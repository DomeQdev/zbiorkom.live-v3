import { Skeleton } from "@mui/material";
import { VehicleType } from "../util/typings";
import { Icon } from "./Icons";
import styled from "@emotion/styled";

const LineNumber = styled.b((props: {
    color: string,
    backgroundColor: string,
}) => ({
    color: props.color,
    backgroundColor: props.backgroundColor,
    border: `1px solid ${props.color}`,
    borderRadius: 25,
    padding: 1,
    paddingLeft: 10,
    paddingRight: 10,
    display: "inline-flex",
    alignItems: "center"
}));

export default ({ type, line, headsign, color, textColor, skeletonWidth }: { type?: VehicleType, line?: string, headsign?: string, color?: string, textColor?: string, skeletonWidth?: number }) => {
    return <div style={{ display: "inline-flex", alignItems: "center" }}>
        {(type && line && headsign && color && textColor) ? <>
            <LineNumber color={textColor} backgroundColor={color}><Icon type={type} style={{ width: 18, height: 18 }} />&nbsp;{line}</LineNumber>&nbsp;{headsign}
        </> : <>
            <Skeleton variant="rectangular" width={55} height={29} style={{ borderRadius: "15px" }} />&nbsp;<Skeleton variant="text" width={skeletonWidth || 80} height={19} />
        </>}
    </div>;
};

export { LineNumber };