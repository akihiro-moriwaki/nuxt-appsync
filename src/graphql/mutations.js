/* eslint-disable */

export const putPost = /* GraphQL */ `
  mutation PutPost(
    $tweet: String!
  ) {
    putPost(
      tweet: $tweet
    ) {
      id
      tweet
    }
  }
`
