import { v4 } from "uuid";

export const handler = async (event: any) => {
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Hello from lambda! ' + v4(),
        }),
    };
}