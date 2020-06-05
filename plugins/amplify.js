import Vue from 'vue'
import Amplify, * as AmplifyModules from 'aws-amplify'
import {AmplifyPlugin, components} from 'aws-amplify-vue'
import awsconfig from '@/src/appsync-exports'

Amplify.configure(awsconfig)

Vue.use(AmplifyPlugin, AmplifyModules)
Vue.component(components)
