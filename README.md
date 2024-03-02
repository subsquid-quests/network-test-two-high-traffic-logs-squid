<p align="center">
<picture>
    <source srcset="https://uploads-ssl.webflow.com/63b5a9958fccedcf67d716ac/64662df3a5a568fd99e3600c_Squid_Pose_1_White-transparent-slim%201.png" media="(prefers-color-scheme: dark)">
    <img src="https://uploads-ssl.webflow.com/63b5a9958fccedcf67d716ac/64662df3a5a568fd99e3600c_Squid_Pose_1_White-transparent-slim%201.png" alt="Subsquid Logo">
</picture>
</p>

[![docs.rs](https://docs.rs/leptos/badge.svg)](https://docs.subsquid.io/)
[![Discord](https://img.shields.io/discord/1031524867910148188?color=%237289DA&label=discord)](https://discord.gg/subsquid)

[Website](https://subsquid.io) | [Docs](https://docs.subsquid.io/) | [Discord](https://discord.gg/subsquid)

[Subsquid Network Docs](https://docs.subsquid.io/subsquid-network/)

# Network Test Two: High Traffic Logs

The network is ready for its first stress test! Help with it by running this squid.

Note: you'll need to have at least 10 tSQD to complete this quest. Obtain them by doing other quests first.

> [!TIP]
> If you locked any of your tSQD before, check if you can unlock any at the [gateways page](https://app.subsquid.io/profile/gateways?testnet).

### I. Install dependencies: Node.js, Docker, Git.

<details>
<summary>On Windows</summary>

1. Enable [Hyper-V](https://learn.microsoft.com/en-us/virtualization/hyper-v-on-windows/quick-start/enable-hyper-v).
2. Install [Docker for Windows](https://docs.docker.com/desktop/install/windows-install/).
3. Install NodeJS LTS using the [official installer](https://nodejs.org/en/download).
4. Install [Git for Windows](https://git-scm.com/download/win).

In all installs it is OK to leave all the options at their default values. You will need a terminal to complete this tutorial - [WSL](https://learn.microsoft.com/en-us/windows/wsl/install) bash is the preferred option.

</details>
<details>
<summary>On Mac</summary>

1. Install [Docker for Mac](https://docs.docker.com/desktop/install/mac-install/).
2. Install Git using the [installer](https://sourceforge.net/projects/git-osx-installer/) or by [other means](https://git-scm.com/download/mac).
3. Install NodeJS LTS using the [official installer](https://nodejs.org/en/download).

We recommend configuring NodeJS to install global packages to a folder owned by an unprivileged account. Create the folder by running
```bash
mkdir ~/global-node-packages
```
then configure NodeJS to use it
```bash
npm config set prefix ~/global-node-packages
```
Make sure that the folder `~/global-node-packages/bin` is in `PATH`. That allows running globally installed NodeJS executables from any terminal. Here is a one-liner that detects your shell and takes care of setting `PATH`:
```
CURSHELL=`ps -hp $$ | awk '{print $5}'`; case `basename $CURSHELL` in 'bash') DEST="$HOME/.bash_profile";; 'zsh') DEST="$HOME/.zshenv";; esac; echo 'export PATH="${HOME}/global-node-packages/bin:$PATH"' >> "$DEST"
```
Alternatively you can add the following line to `~/.zshenv` (if you are using zsh) or `~/.bash_profile` (if you are using bash) manually:
```
export PATH="${HOME}/global-node-packages/bin:$PATH"
```

Re-open the terminal to apply the changes.

</details>
<details>
<summary>On Linux</summary>

Install [NodeJS (v16 or newer)](https://nodejs.org/en/download/package-manager), Git and Docker using your distro's package manager.

We recommend configuring NodeJS to install global packages to a folder owned by an unprivileged account. Create the folder by running
```bash
mkdir ~/global-node-packages
```
then configure NodeJS to use it
```bash
npm config set prefix ~/global-node-packages
```
Make sure that any executables globally installed by NodeJS are in `PATH`. That allows running them from any terminal. Open the `~/.bashrc` file in a text editor and add the following line at the end:
```
export PATH="${HOME}/global-node-packages/bin:$PATH"
```
Re-open the terminal to apply the changes.

</details>

### II. Install Subsquid CLI

Open a terminal and run
```bash
npm install --global @subsquid/cli@latest
```
This adds the [`sqd` command](/squid-cli). Verify that the installation was successful by running
```bash
sqd --version
```
A healthy response should look similar to
```
@subsquid/cli/2.8.6 linux-x64 node-v20.8.0
```

### III. Run the squid

1. Open a terminal and run the following commands to retrieve the squid, enter its folder and install dependencies:
   ```bash
   sqd init high-traffic-logs-squid -t https://github.com/subsquid-quests/network-test-two-high-traffic-logs-squid
   ```
   ```bash
   cd high-traffic-logs-squid
   ```
   ```bash
   npm ci
   ```

2. Press "Get Key" button in the quest card to obtain the `networkTestTwoHighTrafficLogs.key` key file. Save it to the `./query-gateway/keys` subfolder of the squid folder. The file will be used to identify your local query gateway when locking tSQD to allocate bandwidth and as it operates.

3. Get the peer ID of your future gateway by running:
   ```bash
   sqd get-peer-id
   ```

4. Register your future gateway and get computation units (*CUs*) for 10 tSQD on it using [this page](https://app.subsquid.io/profile/gateways/add?testnet). Tips:
   - Gateway registration and tSQD locking are two separate actions. Do not forget to do both.
   - Leave the "Publicly available" switch disabled.
   - The "Lock blocks duration" field lets you tune the length of time during which you'll be able to query the network, measured in blocks of Arbitrum Sepolia's L1 (that is, Ethereum Sepolia). The minumum is five hours, but you can opt to lock for longer if you intend to work on the quest over multiple days.

     | Time              | Blocks |
     |:-----------------:|:------:|
     | 5 hours (minimum) | 1500   |
     | 24 hours          | 7200   |
     | 72 hours          | 21600  |

     Be aware that you'll need to unlock your tokens manually after the end of this period. The tokens you get back will be used in subsequent quests.

     If the locking period expires before you finish your work, simply unlock your tokens, then lock them again.

5. Wait for about 15 minutes. This is the time it takes for Subsquid Network to enter a new epoch, at the beginning of which CUs will be allocated towards your gateway based on how many tSQD you locked.

6. Start the query gateway with
   ```bash
   sqd up
   ```
   If you'd like to check if the locking was successful, you can inspect the logs of the query gateway container with `docker logs <query_gateway_container_name>`. After one-two minutes required for the node startup it should contain some lines like this one:
   ```
   [2024-01-31T14:55:06Z INFO  query_gateway::chain_updates] allocated CU: 48300 spent CU: 0
   ```

7. Build the squid code
   ```bash
   sqd build
   ```

8. Start your squid with
   ```bash
   sqd run .
   ```
   The command should output lines like these:
   ```
   [bsc-processor] {"level":2,"time":1705687630304,"ns":"sqd:commands","msg":"PROCESS:BSC"}
   [eth-processor] {"level":2,"time":1705687630303,"ns":"sqd:commands","msg":"PROCESS:ETH"}
   [moonbeam-processor] {"level":2,"time":1705687630332,"ns":"sqd:commands","msg":"PROCESS:MOONBEAM"}
   [base-processor] {"level":2,"time":1705687630381,"ns":"sqd:commands","msg":"PROCESS:BASE"}
   [eth-processor] 03:07:10 INFO  sqd:processor processing blocks from 11889386
   [bsc-processor] 03:07:10 INFO  sqd:processor processing blocks from 9006623
   [moonbeam-processor] 03:07:10 INFO  sqd:processor processing blocks from 1726375
   [eth-processor] 03:07:10 INFO  sqd:processor using archive data source
   [eth-processor] 03:07:10 INFO  sqd:processor prometheus metrics are served at port 39363
   [base-processor] 03:07:10 INFO  sqd:processor processing blocks from 7492963
   [bsc-processor] 03:07:10 INFO  sqd:processor using archive data source
   [bsc-processor] 03:07:10 INFO  sqd:processor prometheus metrics are served at port 41303
   [moonbeam-processor] 03:07:10 INFO  sqd:processor using archive data source
   [moonbeam-processor] 03:07:10 INFO  sqd:processor prometheus metrics are served at port 46845
   [base-processor] 03:07:10 INFO  sqd:processor using archive data source
   [base-processor] 03:07:10 INFO  sqd:processor prometheus metrics are served at port 45573
   [eth-processor] 03:07:11 WARN  sqd:validation Sentinel value was used in place of BlockHeader.baseFeePerGas. This message will be printed only once. To suppress it entirely set SQD_ALLOW_SENTINEL=BlockHeader.baseFeePerGas env variable. Use commas (,) to separate multiple labels.
   [eth-processor] 03:07:11 INFO  sqd:processor:mapping Got 0 ERC20 transfers
   [eth-processor] 03:07:11 INFO  sqd:processor 11892539 / 18959150, rate: 2377 blocks/sec, mapping: 7439 blocks/sec, 1860 items/sec, eta: 50m
   [eth-processor] 03:07:15 INFO  sqd:processor:mapping Got 0 ERC20 transfers
   [eth-processor] 03:07:16 INFO  sqd:processor:mapping Got 0 ERC20 transfers
   [eth-processor] 03:07:16 INFO  sqd:processor 11916919 / 18959150, rate: 4775 blocks/sec, mapping: 23402 blocks/sec, 2925 items/sec, eta: 25m
   [eth-processor] 03:07:18 INFO  sqd:processor:mapping Got 0 ERC20 transfers
   ```

   The squid should download enough data in 3-4 hours.

> [!TIP]
> Do not worry if the squid fails: any progress it made is saved. Simply restart it if it happens.

When done, stop the squid processor with Ctrl-C, then stop and remove the query gateway container with
```bash
sqd down
```

9. After the locking period ends, go to the [gateways page](https://app.subsquid.io/profile/gateways/) and unlock your tSQD - you will need them for other quests.

# Quest Info

| Category         | Skill Level                          | Time required (minutes) | Max Participants | Reward                              | Status |
| ---------------- | ------------------------------------ | ----------------------- | ---------------- | ----------------------------------- | ------ |
| Squid Deployment | $\textcolor{green}{\textsf{Simple}}$ | ~250                    | -                | $\textcolor{red}{\textsf{75tSQD}}$  | open   |

# Acceptance critera

Sync this squid using the key from the quest card. The syncing progress is tracked by the amount of data the squid has retrieved from [Subsquid Network](https://docs.subsquid.io/subsquid-network).

# About this squid

This [squid](https://docs.subsquid.io/) retrieves `Transfer` events on popular stablecoin contracts on ETH, BSC, Base and Moonbeam. It does not keep any data, as it's sole purpose is to stress test the network.

Data ingester ("processor") code is defined for all networks in `src/testConfig.ts`. The executable `src/main.ts` chooses the settings to use based on its sole command line argument. The scripts file `commands.json` contains commands for running each processor (`process:eth`, `process:bsc`, `process:base` and `process:moonbeam`). You can also use `sqd run` to run all the services at once; the list of services is kept in the [squid manifest](https://docs.subsquid.io/cloud/reference/manifest/) at `squid.yaml`.

The squid uses Phase Two [Subsquid Network](https://docs.subsquid.io/subsquid-network) as its primary data source.

# Troubleshooting

## Network errors

Your squid may get a variety of errors while trying to connect to your local gateway. Some are completely normal, some indicate problems.

### HTTP 503 and 504

It is normal to receive a few of this during the sync. If all the responses you get are 503s or 504s and your gateway fails to serve any data, wait for a few hours and retry. The wait is necessary because this behavior can be caused by a network upgrade, which happen frequently - it's a testnet after all.

### HTTP 403

Typically occurs when the computation units (CUs) you should get for locking your tSQD fail to reach the worker nodes of the network. Here's how to approach fixing it:

1. Make sure you waited for 20 minutes since you ran `sqd up` and try running your squid.
   - You should see no tokens listed as "Pending lock" at the [gateways page](https://app.subsquid.io/profile/gateways?testnet). If you still do see some after about 40 minutes of any locking/relocking operations, [contact support](#contacting-support).
2. If you're still getting 403s, visit the [gateways page](https://app.subsquid.io/profile/gateways?testnet) and ensure that you have some locked tSQD associated with your wallet. To do that, go to your gateway's page and check if the "Unlock" button is greyed out.
   - If it is **NOT**, your locking period had ended. Unlock your tokens, lock them again, restart your gateway with `sqd down` then `sqd up` and go to step 1.
   - If it is, proceed to step 3.
3. If you're still getting 403s, attempt the following:
   - shut your gateway down with `sqd down`
   - remove `./query-gateway/allocations.db`
   - start the gateway with `sqd up`
   - wait for 20 minutes
   - try running your squid
4. If you're still getting 403s, attempt the following
   - shut your gateway down with `sqd down`
   - remove `./query-gateway/allocations.db`
   - **unlock your tSQDs** (may take a while)
   - **lock your tSQDs again**
   - start the gateway with `sqd up`
   - wait for 20 minutes
   - try running your squid

### Connection refused

Can be identified by `ECONNREFUSED` in the squid logs. This means that your query gateway is not running.

1. Check the logs of the gateway container to see if it really isn't running. To get the logs, run `docker logs <query_gateway_container_name>`, where the container name can be found in the output of `sqd up`.
2. Run `sqd get-peer-id` then [check](https://app.subsquid.io/profile/gateways?testnet) if your gateway is registered. If it is, try re-running `sqd up` and then the quest squid.

Alternatively, shut down all the Docker containers in your system (e.g. by rebooting) and start the quest from scratch.

### Timeouts

Try restarting your gateway container by running `sqd down` then `sqd up`. Then, wait for 20 minutes and try running your squid.

# Contacting support

If the standard [troubleshooting](#troubleshooting) fails, contact us via [Discord](https://discord.gg/subsquid). Make sure to attach the logs of your query gateway container as a txt file or via [Pastebin](https://pastebin.com). To get the logs, run `docker logs <query_gateway_container_name>`, where the container name can be found in the output of `sqd up`.
