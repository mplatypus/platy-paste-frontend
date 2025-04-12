# Platy Paste (frontend)

The front end that can be used to create, and view pastes!

You can view a live version of platy paste [here](https://paste.mplaty.com/)

> [!WARNING]
> This project is currently in beta.
>
> See [more](#beta).

## Features

Below is a list of features. The checked boxes mean they have been implemented.

- [x] Pages
    - [x] Create
        - [x] Add multiple documents.
        - [ ] Error handling when pastes fail to upload.
        - [ ] Support tab indenting text.
        - [x] Support more file types.
        - [x] Autodetect file type from name.
        - [x] Expiry support.
    - [x] View
        - [x] View documents.
        - [x] [Shiki](https://shiki.style/) support.
- [ ] UI
    - [ ] More consistency. (General theming and UI design)
    - [ ] Support mobile.
    - [ ] Light / Dark theme.
- [ ] Proper Error handling.

## Beta

This whole project is currently a beta.

Internals **will** be changed, with both the backend and frontend.

Any pastes uploaded during the beta, will be at risk of deletion, so please do not store anything important here.

No data is encrypted as of yet,
so also do not save passwords or private information.
(this should be a given,
no paste can currently be password protected,
with no certainty this feature will ever happen.)

## Setup

This application is currently built and made for [Cloudflare Pages](https://pages.cloudflare.com/).

### Step 1

The first step to hosting your own site, is to fork this repository. [**more**](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/fork-a-repo)

### Step 2

You then need to navigate to the cloudflare pages in your cloudflare account,
and link your github. [**more**](https://developers.cloudflare.com/pages/get-started/git-integration/)

### Step 3

After linking your git account, follow the steps to select the repository (this one that you have cloned).

Once on the **Build Settings** page, follow the following settings.

You can use the default `SvelteKit` framework preset, or use the following settings:

Build command: `npm run build`

Build output directory: `.svelte-kit/cloudflare`

You need to at least set the `PUBLIC_API_URL` environment variable for the site to be able to create/view pastes.

Example environment:

```env
PUBLIC_API_URL = "https://paste.example.com"
```

### Step 4

You can now build and host the site!

> [!TIP]
> Make sure the environment variable for the backend that allows CORS bypass matches the site the pastebin is hosted on!

## Important Links

- [Backend Github](https://github.com/mplatypus/platy-paste-backend)
- [Documentation Github](https://github.com/mplatypus/platy-paste-documentation)
