import { Activity, CreditCard, Info, Headset, CircleCheck, CircleAlert } from "lucide-vue-next";

const iconComponents = {
    Activity,
    CreditCard,
    Info,
    Headset,
    CircleCheck,
    CircleAlert
}

const getIcon = (iconName) => {
    if (iconComponents[iconName]) {
        return iconComponents[iconName];
    }
    console.error(`Icon not found: ${iconName}`);
    return null;
};

export { getIcon }
