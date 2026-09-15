
import os
import json
import subprocess

import sounddevice as sd
import soundfile as sf
import torch

from scipy.io.wavfile import write
from faster_whisper import WhisperModel
from kokoro import KModel
from kemetone.g2p import EgyptianG2P


SAMPLE_RATE = 16000
RECORD_SECONDS = 6

PROJECT_ROOT = r"C:\Users\dell\Desktop\Feqqa"

BRIDGE = os.path.join(
    PROJECT_ROOT,
    "voice-ai-bridge.ts"
)

TSX = os.path.join(
    PROJECT_ROOT,
    "node_modules",
    ".bin",
    "tsx.cmd"
)

VOICE_ROOT = os.path.dirname(
    os.path.abspath(__file__)
)

KEMETONE_MODEL = os.path.join(
    VOICE_ROOT,
    "kemetone.pth"
)

KEMETONE_CONFIG = os.path.join(
    VOICE_ROOT,
    "config.json"
)

KEMETONE_VOICE = os.path.join(
    VOICE_ROOT,
    "voices",
    "kemetone.pt"
)


print("=" * 40)
print("🇪🇬 FEQQA VOICE ASSISTANT")
print("=" * 40)
print()




print(" Loading Whisper...")

whisper = WhisperModel(
    "small",
    device="cpu",
    compute_type="int8"
)

print("Whisper ready!")
print()



print(" Loading KemeTone...")

tts_model = KModel(
    repo_id="Rabe3/kemetone",
    config=KEMETONE_CONFIG,
    model=KEMETONE_MODEL,
).eval()

checkpoint = torch.load(
    KEMETONE_MODEL,
    map_location="cpu",
    weights_only=True
)


def convert_checkpoint_keys(state_dict):
    converted = {}

    for key, value in state_dict.items():

        key = key.replace(
            ".parametrizations.weight.original0",
            ".weight_g"
        )

        key = key.replace(
            ".parametrizations.weight.original1",
            ".weight_v"
        )

        converted[key] = value

    return converted


print(" Fixing KemeTone compatibility...")

for module_name in [
    "bert",
    "bert_encoder",
    "predictor",
    "text_encoder",
    "decoder",
]:

    module = getattr(
        tts_model,
        module_name
    )

    converted = convert_checkpoint_keys(
        checkpoint[module_name]
    )

    module.load_state_dict(
        converted,
        strict=False
    )


tts_voice = torch.load(
    KEMETONE_VOICE,
    map_location="cpu"
)

g2p = EgyptianG2P()

print(" KemeTone ready!")
print()


def record_audio():

    print()
    print(" اتكلمي...")

    audio = sd.rec(
        int(RECORD_SECONDS * SAMPLE_RATE),
        samplerate=SAMPLE_RATE,
        channels=1,
        dtype="int16"
    )

    sd.wait()

    write(
        "question.wav",
        SAMPLE_RATE,
        audio
    )

    print(" التسجيل خلص")

    return "question.wav"



def transcribe(audio_file):

    segments, info = whisper.transcribe(
        audio_file,
        language="ar",
        beam_size=5
    )

    text = " ".join(
        segment.text.strip()
        for segment in segments
    ).strip()

    return text



def normalize_arabic(text):

    text = text.strip()

    replacements = {

        "نقصة": "ناقصة",
        "نقصه": "ناقصة",
        "نقصه عندي": "ناقصة عندي",


        "النهارده": "النهاردة",

        "ازاي": "إزاي",
        "ازاى": "إزاي",
        "ازى": "إزاي",

        "ازيك": "إزيك",
        "ازىك": "إزيك",

        "عايزه": "عايزة",

        "مش عايزه": "مش عايزة",


        "شكرا": "شكراً",
        "شكرًا": "شكراً",
    }

    for wrong, correct in replacements.items():

        text = text.replace(
            wrong,
            correct
        )

    return text


def ask_feqqa(text):

    print()
    print(" Feqqa:", text)

    env = os.environ.copy()

    result = subprocess.run(
        [
            TSX,
            BRIDGE,
            text
        ],
        cwd=PROJECT_ROOT,
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
        env=env
    )

    if result.returncode != 0:

        print(" AI ERROR:")
        print(result.stderr)

        return None

    lines = [
        line.strip()
        for line in result.stdout.splitlines()
        if line.strip()
    ]


    for line in reversed(lines):

        try:

            data = json.loads(line)

            if "error" in data:

                print(" Feqqa error:")
                print(data["error"])

                return None

            if "text" in data:

                return data["text"]

        except json.JSONDecodeError:

            continue

    print(" لم أجد AI response")

    return None


def speak(text):

    print()
    print(" Feqqa بتتكلم:")
    print(text)

    text_for_tts = text

    replacements = {

        "أهلاً بيكي":
            "أَهْلًا بِيكِي",

        "عاملة إيه":
            "عَامْلَة إِيه",

        "عامل إيه":
            "عَامِل إِيه",

        "النهارده":
            "النَّهَارْدَه",

        "النهاردة":
            "النَّهَارْدَه",

        "إزايك":
            "إِزَّايِك",

        "إزيك":
            "إِزَّايِك",

        "أنا":
            "أَنَا",

        "فِقة":
            "فِقَّة",

        "فقة":
            "فِقَّة",

    }

    for original, replacement in replacements.items():

        text_for_tts = text_for_tts.replace(
            original,
            replacement
        )

    print(" TTS text:")
    print(text_for_tts)

    ipa = g2p(text_for_tts)

    print(" IPA:")
    print(ipa)

    with torch.no_grad():

        audio = tts_model(
            ipa,
            tts_voice[len(ipa) - 1]
        )

    audio = audio.detach().cpu()

    output_file = "response.wav"

    sf.write(
        output_file,
        audio.numpy(),
        24000
    )

    print(" Audio saved:", output_file)

    data, samplerate = sf.read(
        output_file,
        dtype="float32"
    )

    sd.play(
        data,
        samplerate
    )

    sd.wait()

    print(" الصوت خلص")



def should_exit(text):

    exit_words = [

        "خلاص",
        "بس كده",
        "اقفلي",
        "اقفل",
        "انهى",
        "انهي",
        "باي",
        "سلام",
        "stop",
        "exit",
        "quit",

    ]

    normalized = text.strip().lower()

    return any(
        word in normalized
        for word in exit_words
    )



print("=" * 40)
print(" فكة جاهزة!")
print()
print("اتكلمي معايا.")
print("ولما تخلصي قولي: خلاص")
print("=" * 40)


while True:

    try:


        audio_file = record_audio()


        text = transcribe(
            audio_file
        )

        if not text:

            print(
                " مفهمتش حاجة، جربي تاني."
            )

            continue


        original_text = text



        text = normalize_arabic(text)


        print()
        print(" YOU SAID:")
        print(text)


        if text != original_text:

            print(" Normalized:")
            print(
                f"{original_text} → {text}"
            )

        if should_exit(text):

            print()
            print("👋 تمام سلام ❤️")

            speak(
                "تمام سلام."
            )

            break


        response = ask_feqqa(text)

        if not response:

            print(
                " حصلت مشكلة في الرد."
            )

            continue


        print()
        print(" FEQQA:")
        print(response)



        speak(response)



        print()
        print("-" * 40)
        print(
            " مستنياكي تسألي السؤال اللي بعده..."
        )
        print("-" * 40)


    except KeyboardInterrupt:

        print()
        print(" Feqqa Voice stopped.")

        break


    except Exception as error:

        print()
        print(" ERROR:")
        print(error)

        print()
        print(
            " هنرجع نستنى السؤال اللي بعده..."
        )
