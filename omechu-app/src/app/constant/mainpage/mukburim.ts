export type mukburimResponse = {
    resultType: string,
    error: null,
    success: {
        id: number,
        user_id: number,
        menu_name: string,
        date: string,
    }
}