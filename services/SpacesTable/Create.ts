import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import { v4 } from "uuid";
import { MissingFieldError, validateAsSpaceEntry } from "../Shared/InputValidator";

const TABLE_NAME = process.env.TABLE_NAME as string;
const dbClient = new DynamoDB.DocumentClient();

export const handler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
    const result: APIGatewayProxyResult = {
        statusCode: 200,
        body: 'Hello from dynamodb!',
    };

    try {
        const item = typeof event.body === 'object' ? event.body : JSON.parse(event.body);
        item.spaceId = v4();
        validateAsSpaceEntry(item);

        await dbClient.put({
            TableName: TABLE_NAME,
            Item: item,
        }).promise();
   
        result.body = JSON.stringify(`Created item with id: ${JSON.stringify(item.spaceId)}`);
    } catch (error) {
        if (error instanceof MissingFieldError) {
            result.statusCode = 403;
        } else {
            result.statusCode = 500;
        }
        result.body = JSON.stringify(error.message);
    }

    return result;
}