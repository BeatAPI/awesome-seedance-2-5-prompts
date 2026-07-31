# Contributing

Thank you for helping build a Seedance 2.5 prompt library that preserves
evidence as well as ideas.

## Acceptance criteria

A submission must include:

- a complete reusable prompt;
- a public output video;
- explicit Seedance 2.5 model evidence;
- the original post, author, and prompt-source URL;
- workflow mode, generation mode, duration, aspect ratio, and reference roles;
- an honest verification state;
- permission to republish any media supplied directly to the repository.

Posts that only announce the model, show a video without the prompt, or share a
prompt without a corresponding output are not accepted as verified pairs.

## Evidence states

- `source-verified`: creator output, prompt, author, and model evidence checked.
- `official-example`: explicitly identified official showcase material.
- `template-unverified`: editorial prompt without publishable output evidence.

## Rights, corrections, and takedowns

A public URL does not transfer copyright. Third-party prompts and media retain
their original rights. To request a correction or removal, open an issue titled
`Takedown: <entry slug>` or email `support@beatapi.io` with the source URL and
your relationship to the work. Credible disputes will have the media hidden
while the request is reviewed.

## Review flow

```text
GitHub Issue → source and rights review → catalog validation → website gallery
```

Run `npm test` before submitting a catalog change.
