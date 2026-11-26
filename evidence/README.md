# Evidence directory

Store reproducible build logs, test output, deployment receipts, verified source references, and adoption queries here. Each artifact must state its source, timestamp, network, command/query and limitations. Do not store private keys, user secrets, or fabricated screenshots/results.

`runtime-test-report.txt` records local EVM tests and a BSC mainnet-state fork run. `bsc-fork-deployment-estimate.json` records fork deployment receipt gas units and constructor argument. `bsc-mainnet-deployment-estimate.json` records a point-in-time read-only RPC gas/fee estimate and unsigned transaction preparation, not a transaction. `slither-report.txt` records static-analysis output and its scope. `agent-id-bsc-rpc-check.json` records registry RPC observations. `github-pages-deployment.json` records the public static preview and CI deployment result.

`local-arena-run.json` records actual isolated local EVM outcomes and a controlled open-versus-protected comparison. It is fixture evidence only and does not count as BNB Chain participation.

No production deployment or qualifying-user evidence exists yet.
