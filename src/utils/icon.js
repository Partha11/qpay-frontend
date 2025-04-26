const getIcon = async (icon) => {
    try {
        const module = await import(`lucide-vue-next`);
        return module[icon];
    } catch (error) {
        console.error(`Failed to load icon: ${icon}`, error);
        return null;
    }
}

export { getIcon }
