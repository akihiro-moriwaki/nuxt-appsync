<template>
  <v-layout
    column
    justify-center
    align-center>
    <v-flex
      xs12
      sm8
      md6>

      <v-card width="500">
        <v-card-title class="headline">
          Tweet
        </v-card-title>
        <v-card-text>
          <form>
            <v-text-field
              v-model="tweet"
              :error-messages="tweetErrors"
              :counter="255"
              label="Tweet"
              required
              @input="$v.tweet.$touch()"
              @blur="$v.tweet.$touch()"></v-text-field>

            <v-btn class="mr-4" @click="submit">submit</v-btn>
            <v-btn @click="clear">clear</v-btn>
          </form>
        </v-card-text>

        <v-col
          v-for="(item, i) in items"
          :key="i"
          cols="12">
          <v-card
            :color="color[i%2]"
            dark>
            <div class="d-flex flex-no-wrap justify-space-between">
              <div>
                <v-card-title
                  class="headline"
                  v-text="item.tweet"></v-card-title>
              </div>
            </div>
          </v-card>
        </v-col>

      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
  import {API, graphqlOperation} from 'aws-amplify'
  import {putPost} from '@/src/graphql/mutations'
  import {onPutPost} from '@/src/graphql/subscriptions'
  import {validationMixin} from 'vuelidate'
  import {required, maxLength} from 'vuelidate/lib/validators'

  export default {
    mixins: [validationMixin],

    validations: {
      tweet: { required, maxLength: maxLength(255) }
    },
    data() {
      return {
        color: ['#1F7087', '#952175'],
        tweet: '',
        items: [],
      }
    },
    mounted() {
      this.init()
    },
    computed: {
      tweetErrors() {
        const errors = []
        if (!this.$v.tweet.$dirty) return errors
        !this.$v.tweet.maxLength && errors.push('Tweet must be at most 255 characters long')
        !this.$v.tweet.required && errors.push('Tweet is required.')
        return errors
      }
    },
    methods: {
      init() {
        API.graphql(graphqlOperation(onPutPost)).subscribe({
          next: eventData => {
            const onPutPost = eventData.value.data.onPutPost
            const item = this.items.find((item) => item.id == onPutPost.id)
            if (item !== undefined) {
              return
            }
            this.items.push(onPutPost)
          }
        })
      },
      async putPost(params) {
        const ret = await API.graphql(
          graphqlOperation(putPost, params)
        )

        this.items.push(ret.data.putPost)
        return ret
      },
      submit() {
        this.$v.$touch()
        const tweet = { tweet: this.tweet }
        this.putPost(tweet)
        this.clear()
      },
      clear() {
        this.$v.$reset()
        this.tweet = ''
      },
    }
  }
</script>
