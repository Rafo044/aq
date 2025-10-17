import replicate

input = {"prompt": "Write a meta-haiku"}

output = replicate.run("anthropic/claude-3.5-haiku", input=input)

print("".join(output))
