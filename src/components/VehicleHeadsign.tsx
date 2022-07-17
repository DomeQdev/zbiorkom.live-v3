import { Skeleton } from "@mui/material";
import { VehicleType } from "../util/typings";
import { Icon, Color } from "./Icons";
import styled from "@emotion/styled";

const LineNumber = styled.b((props: {
    color: string,
    backgroundColor: string,
}) => `
    color: ${props.color};
    background-color: ${props.backgroundColor};
    border-radius: 15px;
    padding: 5px;
    padding-left: 10px;
    padding-right: 10px;
    display: inline-flex;
    align-items: center;
`);

export default ({ type, line, headsign, color, textColor }: { type: VehicleType, line: string, headsign?: string, color?: string, textColor?: string }) => {
    return <div style={{ display: "inline-flex", alignItems: "center" }}>
        {headsign ? <>
            <LineNumber color={textColor || "white"} backgroundColor={color || Color(type)}><Icon type={type} style={{ width: 18, height: 18 }} />&nbsp;{line}</LineNumber>&nbsp;{headsign}
        </> : <>
            <Skeleton variant="rectangular" width={55} height={29} style={{ borderRadius: "15px" }} />&nbsp;<Skeleton variant="text" width={80} height={19} />
        </>}
    </div>;
};