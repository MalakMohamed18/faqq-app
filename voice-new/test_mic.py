import sounddevice as sd
from scipy.io.wavfile import write

SAMPLE_RATE = 16000
DURATION = 5

print("FEQQA VOICE — MIC TEST")
print()
print(" اتكلمي لمدة 5 ثواني...")
print()

audio = sd.rec(
    int(DURATION * SAMPLE_RATE),
    samplerate=SAMPLE_RATE,
    channels=1,
    dtype="int16"
)

sd.wait()

write("test.wav", SAMPLE_RATE, audio)

print()
print(" التسجيل خلص!")
print(" اتعمل الملف: test.wav")