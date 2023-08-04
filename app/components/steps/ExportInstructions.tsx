import { PlatformInstructions } from "@app/components/PlatformInstructions";
import { Platform, PlatformsInfo } from "@pipeline/Platforms";

interface Props {
    platform?: Platform;
}

export const ExportInstructions = ({ platform }: Props) => {
    const info = platform ? PlatformsInfo[platform] : undefined;

    return (
        <div className="ExportInstructions">
            You need to export the chats you want to analyze in {" "} using JSON format.
        </div>
    );
};
