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
        const requestBody = typeof event.body === 'object' ? event.body : JSON.parse(event.body);
        const spaceId = event.queryStringParameters?.[PRIMARY_KEY];
    
        if (requestBody && spaceId) {
            const requestBodyKey = Object.keys(requestBody)[0];
            const requestBodyValue = requestBody[requestBodyKey];
            const updateClient = await dbClient.update({
                TableName: TABLE_NAME,
                Key: {
                    [PRIMARY_KEY]: spaceId,
                },
                UpdateExpression: "set #key = :value",
                ExpressionAttributeNames: {
                    "#key": requestBodyKey,
                },
                ExpressionAttributeValues: {
                    ":value": requestBodyValue,
                },
                ReturnValues: "UPDATED_NEW",
            }).promise();

            result.body = JSON.stringify(updateClient);
        }
    } catch (error) {
        result.body = JSON.stringify(error);
    }

    return result;
}