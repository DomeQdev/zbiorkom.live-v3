import { Badge, Box, Card, Collapse, Dialog, DialogContent, DialogTitle, Fab, IconButton, InputAdornment, List, ListItem, ListItemAvatar, ListItemText, Skeleton, TextField, ToggleButton } from "@mui/material";
import { Add, ArrowDropDown, ArrowDropUp, Close, Edit, NoTransfer, Search } from "@mui/icons-material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { TransitionGroup } from "react-transition-group";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";
import { City, RouteType, VehicleType } from "../../util/typings";
import { Color, Icon, Name } from "../../components/Icons";
import { getData } from "../../util/api";

export default ({ city }: { city: City }) => {
    const [categories, setCategories] = useState<{ [key: string]: string[] }>(JSON.parse(localStorage.getItem(`${city}.categories`) || "{}"));
    const [selectedType, setSelectedType] = useState<VehicleType>();
    const [error, setError] = useState<string | false>(false);
    const [category, setCategory] = useState<string>("");
    const [routes, setRoutes] = useState<RouteType[]>();
    const [search, setSearch] = useState<string>("");
    const { pathname, state } = useLocation();
    const { t } = useTranslation("settings");
    const navigate = useNavigate();
    const searchResults = useMemo(() => routes?.map(r => r.routes.map(route => ({ ...route, type: r.type }))).flat().filter(route => route.name.replace(/[^\w]/gi, "").toLowerCase().includes(search.replace(/[^\w]/gi, "").toLowerCase())), [search]);

    useEffect(() => {
        if (state && !routes) getData("routes", city).then(setRoutes).catch(() => toast.error("Nie mogliśmy pobrać linii..."));
    }, [state]);

    const addCategory = () => {
        if (!category) return setError(t("Category name cannot be empty") as string);
        if (Object.keys(categories).includes(category)) return setError(t("Category already exists") as string);
        setCategory("");
        setCategories({ [category]: [], ...categories, });
        localStorage.setItem(`${city}.categories`, JSON.stringify({ [category]: [], ...categories, }));
    };

    return <Box sx={{ textAlign: "center", width: "90%", mx: "auto" }}>
        <h1 style={{ fontWeight: "normal" }}>{t("Favorite routes") as string}</h1>
        <p>Ta funkcja nie jest jeszcze dostępna.</p>

        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <TextField
                label={t("New category") as string}
                autoComplete="off"
                variant="standard"
                value={category}
                error={!!error}
                helperText={error || ""}
                onChange={({ target }) => {
                    setCategory(target.value);
                    setError(false);
                }}
                onKeyDown={({ key }) => key === "Enter" && addCategory()}
            />
            <IconButton onClick={addCategory}><Add /></IconButton>
        </Box>

        <TransitionGroup>
            {!!Object.keys(categories).length && Object.keys(categories).map(category => <Collapse key={`cat${category}`}>
                <Card variant="outlined" sx={{ bgcolor: "transparent", px: 3, my: 2.5, textAlign: "left", overflow: "inherit" }}>
                    <Box display="flex" justifyContent="space-between">
                        <h3 style={{ paddingBottom: 0 }}>{category}</h3>
                        <div>
                            <Fab size="small" color="primary" sx={{ marginTop: -3, left: -10 }} component={Link} to="." state={category}><Edit /></Fab>
                            <Fab size="small" color="error" sx={{ marginTop: -3 }} onClick={() => {
                                let c = Object.fromEntries(Object.entries(categories).filter(([key]) => key !== category));
                                setCategories(c);
                                localStorage.setItem(`${city}.categories`, JSON.stringify(c));
                            }}><Close /></Fab>
                        </div>
                    </Box>
                    <p>{categories[category].length ? `${categories[category].sort((a, b) => (a.length === b.length) ? a.localeCompare(b) : a.length - b.length).slice(0, 15).join(", ")}${categories[category].length > 15 ? ", ..." : ""}` : t("No routes added") as string}</p>
                </Card>
            </Collapse>)}
        </TransitionGroup>

        <Dialog open={!!state} fullWidth onClose={() => navigate(pathname, { state: undefined, replace: true })}>
            <DialogTitle sx={{ display: "inline-flex", justifyContent: "space-between" }}>
                {state}
                <IconButton component={Link} to={pathname} state={undefined} replace><Close /></IconButton>
            </DialogTitle>
            <DialogContent>
                {routes && categories[state] ? <>
                    <TextField
                        variant="outlined"
                        size="small"
                        placeholder="Wyszukaj linie..."
                        autoComplete="off"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        sx={{ marginTop: 1.2, width: "96%", mx: "2%" }}
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><Search /></InputAdornment>,
                        }}
                    />
                    {search ? searchResults?.length ? <Box sx={{ marginTop: 1.2, width: "96%", mx: "2%", textAlign: "center" }}>
                        {searchResults.map(result => <ToggleButton
                            value={result.id}
                            key={result.id}
                            selected={categories[state].includes(result.id)}
                            onClick={() => {
                                let c = categories[state].includes(result.id) ? categories[state].filter(id => id !== result.id) : [...categories[state], result.id];
                                setCategories({ ...categories, [state]: c });
                                localStorage.setItem(`${city}.categories`, JSON.stringify({ ...categories, [state]: c }));
                            }}
                            sx={{
                                borderRadius: 15,
                                padding: "0 10px",
                                margin: 0.3,
                                color: Color(result.type, city),
                                border: `2px solid ${Color(result.type, city)}`,
                                fill: Color(result.type, city),
                                backgroundColor: "white",
                                ":hover": {
                                    backgroundColor: "white",
                                    color: Color(result.type, city),
                                    fill: Color(result.type, city),
                                },
                                "&.Mui-selected": {
                                    backgroundColor: Color(result.type, city),
                                    color: "white",
                                    fill: "white"
                                },
                                "&.Mui-selected:hover": {
                                    backgroundColor: Color(result.type, city),
                                    color: "white",
                                    fill: "white"
                                }
                            }}
                        >
                            <Icon type={result.type} />&nbsp;{result.name}
                        </ToggleButton>)}
                    </Box> : <div style={{ textAlign: "center" }}>
                        <NoTransfer color="primary" sx={{ width: 60, height: 60, marginTop: 1 }} /><br />
                        <b style={{ fontSize: 17 }}>Nie znaleziono żadnych wyników.</b>
                    </div> : <List>
                        {routes.map(type => <div key={type.type}>
                            <ListItem
                                secondaryAction={<IconButton edge="end" onClick={() => setSelectedType(selectedType === type.type ? undefined : type.type)}>
                                    <Badge variant="dot" color="primary" invisible={!routes.find(r => r.type === type.type)?.routes.find(r => categories[state].includes(r.id))}>
                                        {selectedType === type.type ? <ArrowDropUp /> : <ArrowDropDown />}
                                    </Badge>
                                </IconButton>}
                            >
                                <ListItemAvatar>
                                    <ToggleButton
                                        size="small"
                                        selected
                                        value={type.type}
                                        sx={{
                                            "&.Mui-selected": {
                                                backgroundColor: Color(type.type, city),
                                                color: "white"
                                            },
                                            "&.Mui-selected:hover": {
                                                backgroundColor: Color(type.type, city),
                                                color: "white"
                                            }
                                        }}
                                    ><Icon type={type.type} /></ToggleButton>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={Name(type.type)}
                                    sx={{ cursor: "pointer" }}
                                    onClick={() => setSelectedType(selectedType === type.type ? undefined : type.type)}
                                />
                            </ListItem>
                            <Collapse in={selectedType === type.type}>
                                <ListItem>
                                    <Box sx={{ width: "96%", mx: "2%", textAlign: "center" }}>
                                        {type.routes.map(result => <ToggleButton
                                            value={result.id}
                                            key={result.id}
                                            selected={categories[state].includes(result.id)}
                                            onClick={() => {
                                                let c = categories[state].includes(result.id) ? categories[state].filter(id => id !== result.id) : [...categories[state], result.id];
                                                setCategories({ ...categories, [state]: c });
                                                localStorage.setItem(`${city}.categories`, JSON.stringify({ ...categories, [state]: c }));
                                            }}
                                            sx={{
                                                borderRadius: 15,
                                                padding: "0 10px",
                                                margin: 0.3,
                                                color: Color(type.type, city),
                                                border: `2px solid ${Color(type.type, city)}`,
                                                fill: Color(type.type, city),
                                                backgroundColor: "white",
                                                ":hover": {
                                                    backgroundColor: "white",
                                                    color: Color(type.type, city),
                                                    fill: Color(type.type, city),
                                                },
                                                "&.Mui-selected": {
                                                    backgroundColor: Color(type.type, city),
                                                    color: "white",
                                                    fill: "white"
                                                },
                                                "&.Mui-selected:hover": {
                                                    backgroundColor: Color(type.type, city),
                                                    color: "white",
                                                    fill: "white"
                                                }
                                            }}
                                        >
                                            <Icon type={type.type} />&nbsp;{result.name}
                                        </ToggleButton>)}
                                    </Box>
                                </ListItem>
                            </Collapse>
                        </div>)}
                    </List>}
                </> : <>
                    <Skeleton variant="rectangular" height={40} sx={{ width: "96%", mx: "2%", marginTop: 1.2, borderRadius: 1 }} />
                    <List>
                        {[1, 2, 3, 4].map(i => <ListItem key={i} secondaryAction={<Skeleton variant="circular" width={24} height={24} />}>
                            <ListItemAvatar>
                                <Skeleton variant="rectangular" width={40} height={40} sx={{ borderRadius: 1 }} />
                            </ListItemAvatar>
                            <ListItemText
                                primary={<Skeleton variant="text" width={100} />}
                            />
                        </ListItem>)}
                    </List>
                </>}
            </DialogContent>
        </Dialog>
    </Box>;
};