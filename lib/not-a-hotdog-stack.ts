import * as cdk from '@aws-cdk/core';
import * as apigwv2 from '@aws-cdk/aws-apigatewayv2';
import * as integrations from '@aws-cdk/aws-apigatewayv2-integrations';
import * as lambda from '@aws-cdk/aws-lambda';
import * as path from "path";

export class NotAHotdogStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const botFunc = new lambda.Function(this, 'not-hotdog-bot', {
      handler: "handler",
      runtime: lambda.Runtime.GO_1_X,
      code: lambda.AssetCode.fromAsset(path.join('.build', 'linebot'))
    });

    const api : apigwv2.HttpApi = new apigwv2.HttpApi(this, 'not-hotdog-gateway', {
      defaultIntegration: new integrations.LambdaProxyIntegration({
        handler: botFunc,
      })
    });

    new cdk.CfnOutput(this, 'ApiUrl',{
      value: api.apiEndpoint
    } );
  }
}
