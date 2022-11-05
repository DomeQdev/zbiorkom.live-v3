import { Avatar, Box, Button, List, ListItemAvatar, ListItemButton, ListItemText } from "@mui/material";
import { NavigateNext } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
//todo:check if there is option to get translations from i18n
import translations from "../../util/translations.json";

export default () => {
    const { t, i18n } = useTranslation("settings");

    return <Box sx={{ textAlign: "center", width: "90%", mx: "auto" }}>
        <h1 style={{ fontWeight: "normal" }}>{t("Change language") as string}</h1>
        <List>
            {Object.values(translations).map(lang => <ListItemButton key={lang.info.code} disabled={localStorage.getItem("lang") === lang.info.code} onClick={() => {
                i18n.changeLanguage(lang.info.code);
                localStorage.setItem("lang", lang.info.code);
            }}>
                <ListItemAvatar><Avatar sx={{ width: 30, height: 30 }} src={lang.info.img} /></ListItemAvatar>
                <ListItemText primary={lang.info.name} />
                <NavigateNext />
            </ListItemButton>)}
        </List>
        <Button variant="text" href="https://github.com/DomeQdev/zbiorkom.live-v3/blob/main/src/util/translations.json" target="_blank">{t("Contribute lang") as string}</Button>
    </Box>;
};