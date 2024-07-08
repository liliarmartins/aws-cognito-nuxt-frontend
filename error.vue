<script lang="ts" setup>
const error = useError()
const handleError = async (redirect: string) => {
  await clearError({ redirect })
}
</script>

<template>
  <div v-if="error">
    <section class="hero is-danger is-fullheight">
      <div class="hero-body">
        <div class="container">
          <div class="columns is-centered">
            <div class="column is-5-tablet is-5-desktop is-4-widescreen">
              <div class="column">
                <div v-if="error.statusCode == '401'">
                  <div>
                    <h1 class="title">401</h1>
                    <h2 class="subtitle">Unauthorized</h2>
                  </div>
                  <div>
                    <h2 class="subtitle is-family-monospace mt-4">
                      {{ error.message }}
                    </h2>
                  </div>
                  <div class="mt-3">
                    <button class="button" @click="() => handleError('/login')">
                      Login
                    </button>
                  </div>
                </div>
                <div v-else>
                  <div v-if="error.statusCode == '404'">
                    <h1 class="title">404</h1>
                    <h2 class="subtitle">Resource not found</h2>
                  </div>
                  <div v-if="error.statusCode == '403'">
                    <h1 class="title">403</h1>
                    <h2 class="subtitle">Forbidden</h2>
                  </div>
                  <div v-else>
                    <h1 class="title">{{ error.statusCode }}</h1>
                    <h2 class="subtitle">Something went wrong</h2>
                  </div>
                  <div>
                    <h2 class="subtitle is-family-monospace mt-4">
                      {{ error.message }}
                    </h2>
                  </div>
                  <div class="mt-3">
                    <button class="button" @click="() => handleError('/')">
                      Home
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
