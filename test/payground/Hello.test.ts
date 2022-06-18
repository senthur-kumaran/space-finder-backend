import { APIGatewayProxyEvent } from "aws-lambda";
import { handler } from "../../services/SpacesTable/Create";

const event: APIGatewayProxyEvent = {
    // queryStringParameters: {
    //     spaceId: "bc459967-c448-42bd-90f6-36895cb1a0b8",
    //     // location: "Netherlands"
    // },
    body: JSON.stringify({
        location: "England",
    }),
} as any;

handler(event, {} as any).then(result => {
    const body = JSON.parse(result.body);
    console.log(body);
});