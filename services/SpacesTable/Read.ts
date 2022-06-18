import { APIGatewayProxyEvent, APIGatewayProxyEventQueryStringParameters, APIGatewayProxyResult, Context } from "aws-lambda";
import { DynamoDB } from "aws-sdk";

const TABLE_NAME = process.env.TABLE_NAME;
const PRIMARY_KEY = process.env.PRIMARY_KEY;
const dbClient = new DynamoDB.DocumentClient();

export const handler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
    const result: APIGatewayProxyResult = {
        statusCode: 200,
        body: 'Hello from dynamodb!',
    };

    try {
        if (event.queryStringParameters) {
            if (PRIMARY_KEY! in event.queryStringParameters) {
                result.body = await queryWithPrimaryPartition(event.queryStringParameters);
            } else {
                result.body = await queryWithSecondaryPartition(event.queryStringParameters);
            }
        } else {
            result.body = await scanTable();
        }
    } catch (error) {
        result.body = JSON.stringify(error);
    }

    return result;
}

const queryWithSecondaryPartition = async (queryParameter: APIGatewayProxyEventQueryStringParameters) => {
    const queryKey = Object.keys(queryParameter)[0];
    const queryValue = queryParameter[queryKey];

    const response = await dbClient.query({
        TableName: TABLE_NAME!,
        IndexName: queryKey,
        KeyConditionExpression: '#key = :value',
        ExpressionAttributeNames: {
            '#key': queryKey,
        },
        ExpressionAttributeValues: {
            ':value': queryValue,
        },
    }).promise();
    return JSON.stringify(response.Items);
}

const queryWithPrimaryPartition = async (queryParameter: APIGatewayProxyEventQueryStringParameters) => {
    const response = await dbClient.query({
        TableName: TABLE_NAME!,
        KeyConditionExpression: '#key = :value',
        ExpressionAttributeNames: {
            '#key': PRIMARY_KEY!,
        },
        ExpressionAttributeValues: {
            ':value': queryParameter[PRIMARY_KEY!],
        },
    }).promise();
    return JSON.stringify(response.Items);
};

const scanTable = async () => {
    const response = await dbClient.scan({
        TableName: TABLE_NAME!,
    }).promise();
    return JSON.stringify(response.Items);
};