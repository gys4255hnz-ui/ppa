"""Synthesize narration lines with a running VOICEVOX ENGINE.
usage: python3 voicevox_lines.py lines.tsv out_dir speaker speed
Writes <id>.wav per line and durations.json; prints the kana reading of each line for checking."""
import json, sys, urllib.parse, urllib.request, wave

tsv, out, speaker, speed = sys.argv[1], sys.argv[2], int(sys.argv[3]), float(sys.argv[4])
base = "http://127.0.0.1:50021"
opener = urllib.request.build_opener(urllib.request.ProxyHandler({}))
durs = {}
for line in open(tsv, encoding="utf-8"):
    if not line.strip():
        continue
    lid, text = line.rstrip("\n").split("\t", 1)
    q = urllib.parse.urlencode({"text": text, "speaker": speaker})
    query = json.loads(opener.open(urllib.request.Request(f"{base}/audio_query?{q}", method="POST")).read())
    query.update(speedScale=speed, prePhonemeLength=0.05, postPhonemeLength=0.1)
    req = urllib.request.Request(f"{base}/synthesis?speaker={speaker}", data=json.dumps(query).encode(),
                                 headers={"Content-Type": "application/json"}, method="POST")
    path = f"{out}/{lid}.wav"
    open(path, "wb").write(opener.open(req).read())
    with wave.open(path) as w:
        durs[lid] = round(w.getnframes() / w.getframerate(), 3)
    print(lid, durs[lid], query["kana"])
json.dump(durs, open(f"{out}/durations.json", "w"), indent=1)
print("total", round(sum(durs.values()), 1))
