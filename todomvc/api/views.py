from api.models import TODOItem, TODOList
from rest_framework import viewsets, status
from rest_framework.decorators import list_route
from rest_framework.response import Response

from api.serializers import TODOItemSerializer, TODOListSerializer


class TODOItemViewSet(viewsets.ModelViewSet):
    queryset = TODOItem.objects.all().order_by('-created_at')
    serializer_class = TODOItemSerializer

    @list_route(methods=['delete'])
    def bulk_delete(self, request, *args, **kwargs):
        try:
            ids = request.query_params.get('ids').split(',')
            TODOItem.objects.filter(pk__in=ids).delete()
            return Response({'status': 'ok'})
        except AttributeError:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class TODOListViewSet(viewsets.ModelViewSet):
    queryset = TODOList.objects.all().order_by('-created_at')
    serializer_class = TODOListSerializer
