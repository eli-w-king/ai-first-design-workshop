import { lstat, realpath } from 'node:fs/promises';
import { resolve, dirname, relative, isAbsolute, sep, extname } from 'node:path';
import { pathToFileURL } from 'node:url';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { parseArgs } from 'node:util';

const run = promisify(execFile);

export function validateTiming(videoSeconds, audioSeconds, delayMs) {
  if (![videoSeconds, audioSeconds].every(value => Number.isFinite(value) && value > 0)) throw new Error('Both files need a measured, positive duration.');
  if (!Number.isInteger(delayMs) || delayMs < 0 || delayMs > 10000) throw new Error('Choose a narration delay between 0 and 10000 milliseconds.');
  if (audioSeconds + delayMs / 1000 > videoSeconds) throw new Error('Narration is longer than the video. Shorten it or add real reading holds and record again; do not cut off words.');
}

async function probe(executable, path) {
  const { stdout } = await run(executable, ['-v', 'error', '-show_entries', 'stream=codec_type:format=duration', '-of', 'json', path], { timeout: 30000, maxBuffer: 1024 * 1024 });
  return JSON.parse(stdout);
}

export async function addNarration({ video, audio, output, delayMs = 1200, ffmpeg = 'ffmpeg', ffprobe = 'ffprobe' }) {
  const cwd = await realpath(process.cwd());
  const destination = resolve(output);
  const parent = await realpath(dirname(destination));
  const rel = relative(cwd, parent);
  if (rel === '..' || rel.startsWith(`..${sep}`) || isAbsolute(rel) || extname(destination).toLowerCase() !== '.mp4') {
    throw new Error('Choose a new MP4 output inside the current project.');
  }
  try {
    await lstat(destination);
    throw new Error('The output already exists. Choose a new filename; existing takes are never overwritten.');
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  const [videoInfo, audioInfo] = await Promise.all([probe(ffprobe, resolve(video)), probe(ffprobe, resolve(audio))]);
  if (!videoInfo.streams.some(stream => stream.codec_type === 'video')) throw new Error('The first input must be an actual video.');
  if (videoInfo.streams.some(stream => stream.codec_type === 'audio')) throw new Error('The video already has audio. Review a separate mixing plan instead of silently replacing it.');
  if (!audioInfo.streams.some(stream => stream.codec_type === 'audio')) throw new Error('The narration input has no audio stream.');
  const videoSeconds = Number(videoInfo.format.duration);
  const audioSeconds = Number(audioInfo.format.duration);
  validateTiming(videoSeconds, audioSeconds, delayMs);
  await run(ffmpeg, [
    '-hide_banner', '-loglevel', 'error', '-n', '-i', resolve(video), '-i', resolve(audio),
    '-filter_complex', `[1:a]adelay=${delayMs}:all=1,apad[a]`, '-map', '0:v:0', '-map', '[a]',
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '20', '-c:a', 'aac', '-b:a', '160k',
    '-shortest', '-movflags', '+faststart', destination
  ], { timeout: 90000, maxBuffer: 1024 * 1024 });
  return { status: 'narrated-needs-playback-review', output: relative(cwd, destination), videoSeconds, narrationSeconds: audioSeconds, delayMs };
}

async function main() {
  const { values } = parseArgs({ options: {
    video: { type: 'string' }, audio: { type: 'string' }, output: { type: 'string' },
    'delay-ms': { type: 'string', default: '1200' }, ffmpeg: { type: 'string', default: 'ffmpeg' },
    ffprobe: { type: 'string', default: 'ffprobe' }, help: { type: 'boolean', short: 'h' }
  }});
  if (values.help) {
    console.log('Add approved local narration to a real silent video. No install or upload.\n--video FILE --audio FILE --output NEW.mp4 [--delay-ms 1200]\nRequires existing ffmpeg and ffprobe; optional --ffmpeg and --ffprobe executable paths.');
    return;
  }
  if (!values.video || !values.audio || !values.output) throw new Error('Provide --video, --audio and --output.');
  console.log(JSON.stringify(await addNarration({ video: values.video, audio: values.audio, output: values.output, delayMs: Number(values['delay-ms']), ffmpeg: values.ffmpeg, ffprobe: values.ffprobe }), null, 2));
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main().catch(error => { console.error(error.message); process.exitCode = 1; });
}
