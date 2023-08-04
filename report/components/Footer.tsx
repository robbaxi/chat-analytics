import { getDatabase } from "@report/WorkerWrapper";
import { Tooltip } from "@report/components/core/Tooltip";

import GitHub from "@assets/images/logos/github.svg";
import "@assets/styles/Footer.less";

const extraInfo = () => (
    <>
        Report generated at: <b>{getDatabase().generatedAt}</b>
        <br />
        Build date: <b>{env.build.date}</b>
        <br />
        Build version: <b>v{env.build.version}</b>
    </>
);

export default () => (
    <div className="Footer">
        <span>
            <span>Generated with</span>
            <a href="https://chatanalytics.vercel.app" target="_blank">
                https://chatanalytics.vercel.app
            </a>
        </span>
        <span>•</span>
        <span>
            <Tooltip content={extraInfo()}>
                <span className="Footer__build">build {env.build.commitHash}</span>
            </Tooltip>
        </span>
    </div>
);
