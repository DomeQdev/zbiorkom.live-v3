import { Box, Divider, FormControlLabel, FormGroup, FormHelperText, Switch } from "@mui/material";
import { useTranslation } from "react-i18next";

export default () => {
    const { t } = useTranslation("settings");

    return <Box sx={{ textAlign: "center", width: "90%", mx: "auto" }}>
        <h1 style={{ fontWeight: "normal" }}>{t("Customize vehicle markers") as string}</h1>
        <FormGroup>
            <FormControlLabel control={<Switch />} label={t("Show brigade") as string} />
            <FormHelperText>{t("Brigade explanation") as string}</FormHelperText>

            <FormControlLabel control={<Switch />} label={t("Show vehicle number") as string} />
            <FormHelperText>{t("Vehicle number explanation") as string}</FormHelperText>
        </FormGroup>
        <Divider />
        <i>*to jeszcze nie działa*</i>
    </Box>;
};