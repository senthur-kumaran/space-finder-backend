import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { DynamoDB } from "aws-sdk";

const TABLE_NAME = process.env.TABLE_NAME as string;
const PRIMARY_KEY = process.env.PRIMARY_KEY as string;
const dbClient = new DynamoDB.DocumentClient();

export const handler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
    const result: APIGatewayProxyResult = {
        statusCode: 200,
        body: 'Hello from dynamodb!',
    };

    try {
        const spaceId = event.queryStringParameters?.[PRIMARY_KEY];

        if (spaceId) {
            const deleteClient = await dbClient.delete({
                TableName: TABLE_NAME,
                Key: {
                    [PRIMARY_KEY]: spaceId,
                },
            }).promise();

            result.body = JSON.stringify(deleteClient);
        }
    } catch (error) {
        result.body = JSON.stringify(error);
    }

    return result;
}