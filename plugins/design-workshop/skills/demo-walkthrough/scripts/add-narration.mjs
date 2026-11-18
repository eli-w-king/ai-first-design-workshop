import { lstat, realpath, readFile } from 'node:fs/promises';
import { resolve, dirname, relative, isAbsolute, sep, extname } from 'node:path';
import { pathToFileURL } from 'node:url';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { parseArgs } from 'node:util';
import { createHash } from 'node:crypto';

const run = promisify(execFile);

export function validateTiming(videoSeconds, audioSeconds, delayMs) {
  if (![videoSeconds, audioSeconds].every(value => Number.isFinite(value) && value > 0)) throw new Error('Both files need a measured, positive duration.');
  if (!Number.isInteger(delayMs) || delayMs < 0 || delayMs > 10000) throw new Error('Choose a narration delay between 0 and 10000 milliseconds.');
  if (audioSeconds + delayMs / 1000 > videoSeconds) throw new Error('Narration is longer than the video. Shorten it or add real reading holds and record again; do not cut off words.');
}

async function probe(executable, path, signal) {
  const { stdout } = await run(executable, ['-v', 'error', '-show_entries', 'stream=codec_type:format=duration', '-of', 'json', path], { timeout: 30000, maxBuffer: 1024 * 1024, signal });
  return JSON.parse(stdout);
}

export function durationFromProgress(text) {
  const times = [...text.matchAll(/^out_time=(\d+):([0-5]\d):([0-5]\d(?:\.\d+)?)\r?$/gm)];
  if (!times.length) throw new Error('The decoder did not report a measured duration.');
  const last = times.at(-1);
  const seconds = Number(last[1]) * 3600 + Number(last[2]) * 60 + Number(last[3]);
  if (!Number.isFinite(seconds) || seconds <= 0) throw new Error('The decoded duration must be positive.');
  return seconds;
}

async function decodeDuration(executable, path, stream, signal, optional = false) {
  try {
    const { stdout } = await run(executable, [
      '-nostdin', '-hide_banner', '-loglevel', 'error', '-threads', '2',
      '-progress', 'pipe:1', '-i', path, '-map', `0:${stream}:0`, '-f', 'null', '-'
    ], { timeout: 90000, maxBuffer: 1024 * 1024, signal });
    return durationFromProgress(stdout);
  } catch (error) {
    if (optional && error.code === 1 && String(error.stderr).includes(`Stream map '0:${stream}:0' matches no streams`)) return null;
    throw error;
  }
}

export function validateFinalHold(videoSeconds, targetSeconds, actionsFinishedSeconds) {
  if (![videoSeconds, targetSeconds, actionsFinishedSeconds].every(Number.isFinite) ||
      targetSeconds <= 0 || targetSeconds > videoSeconds || actionsFinishedSeconds < 0 ||
      actionsFinishedSeconds + (videoSeconds - targetSeconds) + 2.5 > targetSeconds) {
    throw new Error('Trim only surplus final idle with at least 2.5 seconds after all actions. Otherwise shorten the flow and retake.');
  }
}

export async function addNarration({ video, audio, output, delayMs = 1200, ffmpeg, ffprobe, runtime, durationSeconds, recordingResult }) {
  const encoder = ffmpeg ?? process.env.FFMPEG_BIN ?? (runtime ? resolve(runtime, 'node_modules/ffmpeg-static', process.platform === 'win32' ? 'ffmpeg.exe' : 'ffmpeg') : 'ffmpeg');
  const cwd = await realpath(process.cwd());
  const destination = resolve(output);
  const parent = await realpath(dirname(destination));
  const rel = relative(cwd, parent);
  if (rel === '..' || rel.startsWith(`..${sep}`) || isAbsolute(rel) || extname(destination).toLowerCase() !== '.mp4') {
    throw new Error('Choose a new MP4 output inside the approved recording folder, outside the project by default.');
  }
  try {
    await lstat(destination);
    throw new Error('The output already exists. Choose a new filename; existing takes are never overwritten.');
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  const controller = new AbortController();
  const interrupt = () => controller.abort();
  process.once('SIGINT', interrupt);
  process.once('SIGTERM', interrupt);
  try {
    let videoInfo, audioInfo;
    if (ffprobe) {
      [videoInfo, audioInfo] = await Promise.all([probe(ffprobe, resolve(video), controller.signal), probe(ffprobe, resolve(audio), controller.signal)]);
    } else {
      const [videoDuration, existingAudio, audioDuration] = await Promise.all([
        decodeDuration(encoder, resolve(video), 'v', controller.signal),
        decodeDuration(encoder, resolve(video), 'a', controller.signal, true),
        decodeDuration(encoder, resolve(audio), 'a', controller.signal)
      ]);
      videoInfo = { streams: [{ codec_type: 'video' }, ...(existingAudio === null ? [] : [{ codec_type: 'audio' }])], format: { duration: videoDuration } };
      audioInfo = { streams: [{ codec_type: 'audio' }], format: { duration: audioDuration } };
    }
    if (!videoInfo.streams.some(stream => stream.codec_type === 'video')) throw new Error('The first input must be an actual video.');
    if (videoInfo.streams.some(stream => stream.codec_type === 'audio')) throw new Error('The video already has audio. Review a separate mixing plan instead of silently replacing it.');
    if (!audioInfo.streams.some(stream => stream.codec_type === 'audio')) throw new Error('The narration input has no audio stream.');
    const videoSeconds = Number(videoInfo.format.duration);
    const audioSeconds = Number(audioInfo.format.duration);
    let finalSeconds = videoSeconds;
    if (durationSeconds !== undefined) {
      if (!recordingResult) throw new Error('A fixed-duration export needs the matching recording result and its video checksum.');
      const receipt = JSON.parse(await readFile(recordingResult, 'utf8'));
      if (!receipt.flowChecksPassed || receipt.videoSha256 !== createHash('sha256').update(await readFile(video)).digest('hex')) {
        throw new Error('The recording result does not verify this video. Retain the original and review it first.');
      }
      validateFinalHold(videoSeconds, durationSeconds, receipt.actionsFinishedSeconds);
      finalSeconds = durationSeconds;
    }
    validateTiming(finalSeconds, audioSeconds, delayMs);
    await run(encoder, [
      '-nostdin', '-hide_banner', '-loglevel', 'error', '-n', '-threads', '2', '-i', resolve(video), '-i', resolve(audio),
      '-filter_complex', `[1:a]adelay=${delayMs}:all=1,apad[a]`, '-map', '0:v:0', '-map', '[a]',
      '-c:v', 'libx264', '-threads', '2', '-preset', 'veryfast', '-pix_fmt', 'yuv420p', '-crf', '20', '-r', '30', '-c:a', 'aac', '-b:a', '160k',
      ...(durationSeconds === undefined ? [] : ['-t', String(finalSeconds)]), '-shortest', '-movflags', '+faststart', destination
    ], { timeout: 90000, maxBuffer: 1024 * 1024, signal: controller.signal });
    return { status: 'narrated-needs-playback-review', output: relative(cwd, destination), videoSeconds, finalSeconds, narrationSeconds: audioSeconds, delayMs };
  } finally {
    controller.abort();
    process.removeListener('SIGINT', interrupt);
    process.removeListener('SIGTERM', interrupt);
  }
}

async function main() {
  const { values } = parseArgs({ options: {
    video: { type: 'string' }, audio: { type: 'string' }, output: { type: 'string' },
    'delay-ms': { type: 'string', default: '1200' }, ffmpeg: { type: 'string' },
    ffprobe: { type: 'string' }, runtime: { type: 'string' }, duration: { type: 'string' }, 'recording-result': { type: 'string' }, help: { type: 'boolean', short: 'h' }
  }});
  if (values.help) {
    console.log('Add approved local narration to a real silent video. No install or upload.\n--video FILE --audio FILE --output NEW.mp4 [--delay-ms 1200]\nRequires a full ffmpeg only. Use --runtime TOOL_CACHE for ffmpeg-static, or --ffmpeg EXECUTABLE.\nAn existing --ffprobe is optional; otherwise ffmpeg measures durations by decoding.\n--duration 30 --recording-result FILE trims only verified surplus final idle, keeping the raw take.');
    return;
  }
  if (!values.video || !values.audio || !values.output) throw new Error('Provide --video, --audio and --output.');
  console.log(JSON.stringify(await addNarration({ video: values.video, audio: values.audio, output: values.output, delayMs: Number(values['delay-ms']), ffmpeg: values.ffmpeg, ffprobe: values.ffprobe, runtime: values.runtime, durationSeconds: values.duration === undefined ? undefined : Number(values.duration), recordingResult: values['recording-result'] }), null, 2));
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main().catch(error => { console.error(error.message); process.exitCode = 1; });
}
