# GitHub Pages artifact failure investigation

Date: 2026-11-26

## Observed run

Commit: `bbcbec3df54a70d101f8ab055c5c6cff0ab9dcc9`

Run: https://github.com/MANDAVEX/protocol/actions/runs/45721412780

The `Upload static preview` step succeeded. GitHub Actions displayed a `github-pages` artifact of 4.5 KB with digest `sha256:be4c9ff49bfd985baf6d4e0f41b0c34521b9c21208b3b98ea08cea076d517a36`. The immediately following `Publish preview` step failed at deploy-pages artifact metadata lookup with “No artifacts named `github-pages` were found”. GitHub's log also reported that metadata fetch failed and suggested retrying. The web page remained reachable, but that run did not establish that commit was published.

## Diagnosis and repair

The workflow had uploaded and deployed in consecutive steps in the same job. The failure is consistent with the open action-maintainer report [actions/deploy-pages issue #451](https://github.com/actions/deploy-pages/issues/451), which documents an intermittent race where the artifact is finalized but the deploy lookup briefly sees no artifact. The issue reports moving upload and deployment to separate jobs as a workaround.

`.github/workflows/pages.yml` now uses a `build` job to create `build-info.json` and upload the Pages artifact, then a dependent `deploy` job. Deployment-only permissions (`pages: write`, `id-token: write`) are scoped to the deploy job. Both jobs use current Pages action versions, and the deployment explicitly selects artifact name `github-pages`.

## Verification still required

The repair is implemented but unverified until a fresh push produces a successful Pages deployment. The workflow's public build metadata is intended to expose the exact deployed commit after that succeeds. The existing public page is static preview content and does not submit Guard transactions.
