export default null as any;

import { BlockRequestMessage, BlockResultMessage, InitMessage, ReadyMessage } from "@pipeline/Messages";
import { BlocksDesc, BlocksProcessFn } from "@pipeline/blocks/Blocks";
import { ReportData } from "@pipeline/process/ReportData";
import { DataDeserializer } from "@pipeline/shared/SerializedData";
import { Filters } from "@pipeline/blocks/Filters";
import { decompress } from "@pipeline/shared/Compression";

let reportData: ReportData | null = null;
let dataDeserializer: DataDeserializer | null = null;
let filters: Filters | null = null;

const init = async (msg: InitMessage) => {
    const [_reportData, serializedData] = await decompress(msg.dataStr);
    reportData = _reportData;
    dataDeserializer = new DataDeserializer(serializedData);
    filters = new Filters(reportData.authors.length);

    self.postMessage(<ReadyMessage>{
        type: "ready",
        reportData,
        blocksDesc: BlocksDesc,
    });

    if (env.isDev) {
        console.log(reportData, serializedData);
    }
};

const request = async (msg: BlockRequestMessage) => {
    if (!filters || !reportData || !dataDeserializer) throw new Error("No data provided");

    const br = msg;
    // update active data if provided
    if (br.filters.channels) filters.updateChannels(br.filters.channels);
    if (br.filters.authors) filters.updateAuthors(br.filters.authors);
    if (br.filters.startDate) filters.updateStartDate(br.filters.startDate);
    if (br.filters.endDate) filters.updateEndDate(br.filters.endDate);

    try {
        if (!(br.blockKey in BlocksProcessFn)) throw new Error("BlockFn not found");

        console.time(br.blockKey);
        const data = BlocksProcessFn[br.blockKey](reportData, dataDeserializer, filters);
        console.timeEnd(br.blockKey);

        self.postMessage(<BlockResultMessage>{
            type: "result",
            blockKey: br.blockKey,
            state: "ready",
            data,
        });
    } catch (err) {
        console.error(err);
        self.postMessage(<BlockResultMessage>{
            type: "result",
            blockKey: br.blockKey,
            state: "error",
            data: null,
        });
    }
};

self.onmessage = async (ev: MessageEvent<InitMessage | BlockRequestMessage>) => {
    switch (ev.data.type) {
        case "init":
            init(ev.data);
            break;
        case "request":
            request(ev.data);
            break;
    }
};

console.log("WorkerReport started");
