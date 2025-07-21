class UUID {
    constructor(){}
    generateUUID(){
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8); // Garante que o "y" será entre 8 e B
        return v.toString(16);
        });
    }
}

export default UUID;