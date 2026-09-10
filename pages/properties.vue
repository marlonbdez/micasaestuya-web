<script setup lang="ts">
// import { IFirebaseInstance } from "~/core/types.d";
// const { $firebase } = useNuxtApp();

// const properties = await (
//   $firebase as IFirebaseInstance
// ).propertyModule.getProperties();

// console.log("properties", properties);

// async function deleteProperty(propertyId: string): Promise<void> {
//   try {
//     await ($firebase as IFirebaseInstance).propertyModule.deleteProperty(
//       propertyId
//     );
//   } catch (error) {
//     console.error("Unable to delete the property:", error);
//   }
// }

definePageMeta({
  middleware: ['auth']
})
</script>

<template>
  <main class="container">
    <h2>Properties: Work in progress</h2>

    <!-- <BaseAlert>
      <BaseIcon icon="house" size="lg" />
      So far {{ properties.length }} properties have beed added.
    </BaseAlert>
    <BaseCta to="/property/add">Add new property</BaseCta>

    <ul class="property-list">
      <li v-for="property in properties" :key="property.id" class="list-item">
        <span> {{ property.id }} - {{ property.description }}</span>
        <div class="actions">
          <BaseCta :to="`/property/${property.id}/edit`">Edit</BaseCta>
          <BaseCta :to="`/property/${property.id}/view`">View</BaseCta>
          <BaseCta @click="deleteProperty(property.id)">Delete</BaseCta>
        </div>
      </li>
    </ul> -->
  </main>
</template>

<style lang="scss" scoped>
.property-list {
  list-style: none;
  padding: 0;
}

.list-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.list-item span {
  @include font-roboto-light;
  margin-right: 10px;
}
.actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
