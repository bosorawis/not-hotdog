import * as cdk from '@aws-cdk/core';
import * as apigwv2 from '@aws-cdk/aws-apigatewayv2';
import * as ssm from '@aws-cdk/aws-ssm';
import * as iam from '@aws-cdk/aws-iam';
import * as integrations from '@aws-cdk/aws-apigatewayv2-integrations';
import * as lambda from '@aws-cdk/aws-lambda';
import * as path from "path";
import {HttpMethod} from "@aws-cdk/aws-apigatewayv2/lib/http/route";

export class NotAHotdogStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const secret = ssm.StringParameter.fromStringParameterAttributes(this, 'lineSecret', {
      parameterName: 'NOT_HOTDOG_CHANNEL_SECRET',
    }).stringValue;
    const token = ssm.StringParameter.fromStringParameterAttributes(this, 'lineToken', {
      parameterName: 'NOT_HOTDOG_CHANNEL_TOKEN',
    }).stringValue;

    const botFunc = new lambda.Function(this, 'not-hotdog-bot', {
      handler: "handler",
      runtime: lambda.Runtime.GO_1_X,
      code: lambda.AssetCode.fromAsset(path.join('.build', 'linebot')),
      environment:{
        NOT_HOTDOG_CHANNEL_SECRET: secret,
        NOT_HOTDOG_CHANNEL_TOKEN: token
      }
    });
    botFunc.addToRolePolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        'rekognition:DetectLabels'
      ],
      resources: ['*'],
    }));

    const api : apigwv2.HttpApi = new apigwv2.HttpApi(this, 'not-hotdog-gateway', {});

    const webhookRoute = new apigwv2.HttpRoute(this, 'webhook', {
      routeKey: apigwv2.HttpRouteKey.with('/webhook', HttpMethod.POST),
      httpApi: api,
      integration: new integrations.LambdaProxyIntegration({
        handler: botFunc,
      })
    });

    new cdk.CfnOutput(this, 'ApiUrl',{
      value: `${api.apiEndpoint}/webhook`
    } );
  }
}
