import React from 'react'

import type { Action } from '@remix-run/data'
import { redirect } from '@remix-run/data'
import { Form, usePendingFormSubmit } from '@remix-run/react'

// Add the action
export const action: Action = async ({ request }) => {
  // Very important or else it won't work :)
  const token = process.env.GITHUB_GISTS
  // in a real world scenario you'd want this token to be an environment
  // variable on your server, but as long as you only use it in this action, it
  // won't get included in the browser bundle.

  // When the form request posts here, this helper turns it into a FormData
  const body = new URLSearchParams(await request.text())

  // pull off what we need from the form, note they are named the same thing
  // as the `<input/>` in the form.
  const fileName = body.get('fileName') as string
  const content = body.get('content')

  // Hit the GitHub API to create a gist
  await fetch('https://api.github.com/gists', {
    method: 'post',
    body: JSON.stringify({
      description: 'Created from Remix Form!',
      public: true,
      files: { [fileName]: { content } },
    }),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `token ${token}`,
    },
  })

  // you always have to redirect from actions
  return redirect('/gists')
}

function Loading() {
  return (
    <svg
      className="spin"
      style={{ height: '1rem' }}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
      />
    </svg>
  )
}

export default function NewGist(): JSX.Element {
  const pendingForm = usePendingFormSubmit()

  return (
    <div>
      <h2>New Gist!</h2>
      {pendingForm ? (
        <div>
          <p>
            <Loading /> Creating gist: {pendingForm.data.get('fileName')}
          </p>
        </div>
      ) : (
        <Form method="post">
          <p>
            <label>
              Gist file name:
              <br />
              <input required type="text" name="fileName" />
            </label>
          </p>
          <p>
            <label>
              Content:
              <br />
              <textarea required rows={10} name="content" />
            </label>
          </p>
          <p>
            <button type="submit">Create Gist</button>
          </p>
        </Form>
      )}
    </div>
  )
}
