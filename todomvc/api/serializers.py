from api.models import TODOList, TODOItem
from rest_framework import serializers


class TODOListSerializer(serializers.ModelSerializer):
    class Meta:
        model = TODOList
        fields = ('id', 'name', 'items', 'created_at')
        depth = 1


class TODOItemSerializer(serializers.ModelSerializer):
    list = serializers.PrimaryKeyRelatedField(queryset=TODOList.objects.all())

    class Meta:
        model = TODOItem
        fields = ('id', 'title', 'list', 'completed', 'created_at')
        depth = 1
