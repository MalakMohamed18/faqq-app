from faster_whisper import WhisperModel

print(" FEQQA — REAL STT TEST")

print()

MODEL_SIZE = "small"

print("Loading Whisper model...")
model = WhisperModel(
    MODEL_SIZE,
    device="cpu",
    compute_type="int8"
)

print(" Model loaded!")
print()
print(" Transcribing test.wav...")
print()

segments, info = model.transcribe(
    "test.wav",
    language="ar",
    beam_size=5,
    vad_filter=True
)

text = ""

for segment in segments:
    text += segment.text

text = text.strip()


print(" TRANSCRIPT:")
print(text)
print()
print(f" Detected language: {info.language}")
print(f" Probability: {info.language_probability:.2f}")