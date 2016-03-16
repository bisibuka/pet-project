from __future__ import unicode_literals

from django.db import models


class TODOList(models.Model):
    name = models.CharField(unique=True, max_length=100, blank=False, null=False)
    created_at = models.DateTimeField(blank=False, null=False, auto_now_add=True)
    updated_at = models.DateTimeField(blank=False, null=False, auto_now=True)

    def __unicode__(self):
        return self.name


class TODOItem(models.Model):
    title = models.CharField(max_length=255, null=False, blank=False)
    list = models.ForeignKey(TODOList, blank=True, null=True, related_name='items')
    completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(blank=False, null=False, auto_now_add=True)
    updated_at = models.DateTimeField(blank=False, null=False, auto_now=True)

    def __unicode__(self):
        return '{} ({})'.format(self.title, self.list)
