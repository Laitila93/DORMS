<!--View where user can see all daily, weekly, monthly, and special
     challenges. Current, completed, and future challenges can be
     viewed.
    Total collected points and a direct link to the shop is available.
    There is also a function for the user to change daily challenges.-->

    <template>
        <NavComponent :menu="navMenuType" />
        <div class="grid grid-cols-[168px_1fr] h-screen">
    <!-- Sidebar -->
    <div class="p-4">
      <VerticalmenuCompnent :menu="menuType" @menu-select="handleMenuSelect" />
    </div>

        </div>

    
</template>
