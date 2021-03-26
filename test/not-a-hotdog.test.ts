import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as NotAHotdog from '../lib/not-a-hotdog-stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new NotAHotdog.NotAHotdogStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
