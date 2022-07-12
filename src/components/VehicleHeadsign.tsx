import styled from "@emotion/styled";
import { VehicleType } from "../util/typings";
import { Icon, Color } from "./Icons";

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

export default ({ type, line, headsign, color }: { type: VehicleType, line: string, headsign?: string, color?: string }) => {
    return <div style={{ display: "inline-flex", alignItems: "center" }}>
        <LineNumber color={"white"} backgroundColor={color || Color(type)}><Icon type={type} style={{ width: 18, height: 18 }} />&nbsp;{line}</LineNumber>&nbsp;{headsign}
    </div>;
};