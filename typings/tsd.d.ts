interface Window {
    AudioContext: AudioContext;
    webkitAudioContext: AudioContext;
}

interface AudioBuffer
{
	copyToChannel: Function;
	copyFromChannel: Function;
}