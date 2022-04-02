<template>
  <section id="orders">
    <v-row>
      <v-col cols="8" class="offset-md-2">

        <v-toolbar class="mb-2">
          <v-toolbar-title>
            Listes
          </v-toolbar-title>

          <template v-slot:extension>
            <v-tabs v-model="selectedTab" align-with-title>
              <v-tab v-for="i in ['Coups de coeurs', 'Liste d envies']" :key="i">{{ i }}</v-tab>
            </v-tabs>
          </template>
        </v-toolbar>


        <v-tabs-items v-model="selectedTab">
          <v-tab-item>
            
            <v-row>
              <v-col cols="12">
                
              </v-col>
              
              <v-col cols="12">
                <h4>Derniers articles consultés</h4>
                <v-row>
                  <v-col  v-for="i in 6" :key="i" cols="3">
                    <router-link :to="{ name: 'home', params: { lang: $i18n.locale } }">
                      <v-img src="http://via.placeholder.com/100x100"></v-img>
                    </router-link>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>

          </v-tab-item>

          <v-tab-item>
            <v-card flat>
              <v-card-text>

                <v-expansion-panels>
                  <v-expansion-panel v-for="i in 4" :key="i" accordion>
                    <v-expansion-panel-header>
                      <v-row>
                        <v class="col" cols="2">
                          <v-img src="http://via.placeholder.com/80x80" width="80"></v-img>
                        </v>
                        <v-col cols="auto">
                          Product {{ i }}
                        </v-col>
                      </v-row>
                     
                    </v-expansion-panel-header>

                    <v-expansion-panel-content>
                      <v-btn class="mr-2">Ajouter au panier</v-btn>
                      
                      <v-menu :close-on-content-click="true" :open-on-hover="false" :rounded="false" transition="scale-transition">
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn v-bind="attrs" class="mr-2" v-on="on">Déplacer</v-btn>
                        </template>
                        <v-list>
                          <v-list-item>
                            <v-list-item-title>list 1</v-list-item-title>
                          </v-list-item>

                          <v-list-item>
                            <v-list-item-title>list 2</v-list-item-title>
                          </v-list-item>
                        </v-list>
                      </v-menu>

                      <v-btn>Supprimer</v-btn>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>
                
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-col>
    </v-row>
  </section>
</template>

<script>
export default {
  name: 'UserLists',
  data: () => ({
    selectedTab: 0
  })
}
</script>
