import { Stack, StackProps } from "aws-cdk-lib";
import { LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { Code, Function, Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { join } from "path";
import { GenericTable } from "./GenericTable";

export class SpaceStack extends Stack {
    private api = new RestApi(this, 'SpaceFinderApi');
    private spacesTable = new GenericTable('SpacesTable', 'spaceId', this);

    constructor(scope: Construct, id: string, props: StackProps) {
        super(scope, id, props);

        const helloLambda = new Function(this, 'helloLambda', {
            runtime: Runtime.NODEJS_16_X,
            code: Code.fromAsset(join(__dirname, '..', 'services', 'hello')),
            handler: 'hello.main',
        });

        const helloLambdaWebpack = new Function(this, 'helloLambdaWebpack', {
            runtime: Runtime.NODEJS_16_X,
            code: Code.fromAsset(join(__dirname, '..', 'build', 'helloLambdaFunction')),
            handler: 'helloLambdaFunction.handler',
        });

        const helloLambdaFunction = new NodejsFunction(this, 'helloLambdaFunction', {
            entry: join(__dirname, '..', 'services', 'node-lambda', 'hello.ts'),
            handler: 'handler',
        });

        // Hello Api lambda integration:
        const helloLambdaIntegration = new LambdaIntegration(helloLambda);
        const helloLambdaResource = this.api.root.addResource('hello');
        helloLambdaResource.addMethod('GET', helloLambdaIntegration);
    }
}