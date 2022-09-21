import { Skeleton } from "@mui/material";
import { City, VehicleType } from "../util/typings";
import { Color, Icon } from "./Icons";
import styled from "@emotion/styled";

const LineNumber = styled.b((props: {
    backgroundColor: string,
}) => ({
    color: "white",
    backgroundColor: props.backgroundColor,
    borderRadius: 25,
    padding: 1,
    paddingLeft: 10,
    paddingRight: 10,
    display: "inline-flex",
    alignItems: "center"
}));

export default ({ type, city, line, headsign, skeletonWidth }: { type?: VehicleType, city?: City, line?: string, headsign?: string, skeletonWidth?: number }) => {
    return <div style={{ display: "inline-flex", alignItems: "center" }}>
        {(type != null && line != null && headsign != null && city != null) ? <>
            <LineNumber backgroundColor={Color(type, city)}><Icon type={type} style={{ width: 18, height: 18 }} />&nbsp;{line}</LineNumber>{headsign && <>&nbsp;{headsign}</>}
        </> : <>
            <Skeleton variant="rectangular" width={55} height={29} style={{ borderRadius: "15px" }} />&nbsp;<Skeleton variant="text" width={skeletonWidth || 80} height={19} />
        </>}
    </div>;
};

export { LineNumber };