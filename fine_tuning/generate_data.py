import re
import json

def process_line(line):
    # Remove cloze tags to create the user content
    user_content = re.sub(r"{{c\d::(.*?)}}", r"\1", line).strip()
    # Assistant content is the original line with cloze tags
    assistant_content = line.strip()
    return {"user": user_content, "assistant": assistant_content}

def prepare_data(input_file, output_file):
    system_content = (
        "You are an expert helping with USMLE Step 1. Convert statements into cloze-style Anki cards "
        "using {{c1::}} for key terms or concepts. Focus on high-yield information."
    )
    
    with open(input_file, "r", encoding="utf-8") as infile, open(output_file, "w", encoding="utf-8") as outfile:
        for line in infile:
            if line.strip():  # Skip empty lines
                processed = process_line(line)
                entry = {
                    "messages": [
                        {"role": "system", "content": system_content},
                        {"role": "user", "content": processed["user"]},
                        {"role": "assistant", "content": processed["assistant"]}
                    ]
                }
                json.dump(entry, outfile)
                outfile.write("\n")

if __name__ == "__main__":
    dataset = "anki"
    input_file = f"data/{dataset}.txt"
    output_file = f"{dataset}_dataset.jsonl"
    prepare_data(input_file, output_file)
    print(f"Data has been prepared and saved to {output_file}")