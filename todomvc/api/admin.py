from django.contrib import admin
from reversion.admin import VersionAdmin

from api.models import TODOList, TODOItem


class TODOItemAdmin(admin.TabularInline):
    model = TODOItem


class TODOListAdmin(VersionAdmin):
    inlines = [TODOItemAdmin,]
admin.site.register(TODOList, TODOListAdmin)
