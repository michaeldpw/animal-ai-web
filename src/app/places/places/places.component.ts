import {AfterViewInit, Component, OnInit} from '@angular/core';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import {PlaceService} from '../../services/place.service';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-places',
  standalone: false,

  templateUrl: './places.component.html',
  styleUrl: './places.component.scss'
})
export class PlacesComponent implements OnInit, AfterViewInit{
  map!: mapboxgl.Map;
  geocoder!: MapboxGeocoder;
  drawerVisible = false;
  // 经纬度绑定变量
  longitude: number | null = null;
  latitude: number | null = null;

  locations: any = [];

  constructor(private placeService: PlaceService, private messageService: MessageService
  ) {
  }

  ngOnInit() {
    (mapboxgl as any).accessToken = 'pk.eyJ1IjoicGVpd2VuZDciLCJhIjoiY205emphcDdlMXRsNTJxcHZpZHlpenUzdCJ9.X-oKqYC8nvyz-Hi8Zd0ASQ';
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-zh-v1', // 可换成 satellite 等

      zoom: 10,
    });

    this.placeService.getAllPlaces().subscribe((places: any) => {
      console.log(places);
      places.map((place: any) => {
        this.locations.push({lng: Number(place.longitude!), lat: Number(place.latitude!)});

      });
      const bounds = new mapboxgl.LngLatBounds();

      this.locations.forEach((loc: any) => {
        const marker = new mapboxgl.Marker({ color: '#ff69b4' }) // 粉红色标记
          .setLngLat([loc.lng, loc.lat])
          // .setPopup(new mapboxgl.Popup().setHTML(`<h3>${loc.name}</h3>`))
          .addTo(this.map);

        bounds.extend([loc.lng, loc.lat]);
      });
      // 自动缩放地图以包含所有标记点
      this.map.fitBounds(bounds, { padding: 50, duration: 1000 });

    })







  }

  showDrawer() {
    this.drawerVisible = true;

    setTimeout(() => {
      if (!this.geocoder) {
        this.geocoder = new MapboxGeocoder({
          accessToken: (mapboxgl as any).accessToken,
          // mapboxgl: mapboxgl,
          placeholder: '输入城市或地区名...',
          language: 'zh-cn', // 中文界面
          countries: '', // 空代表全球搜索
          types: 'place', // 城市级别
          marker: false, // 不自动添加 marker
        });

        this.geocoder.addTo('#geocoder-container');

        // 绑定结果事件
        this.geocoder.on('result', (e: any) => {
          console.log(e.result.geometry.coordinates);
          const [lng, lat] = e.result.geometry.coordinates;
          this.longitude = lng;
          this.latitude = lat;
          // this.map.flyTo({ center: [lng, lat], zoom: 8 });
        });
      }
    }, 200); // 等待 Drawer 渲染完成
  }

  addPlace() {

  }

  onDrawerClose() {
    // 可选：重置 geocoder UI
    // this.geocoder.clear();
  }

  ngAfterViewInit() {
  }

  submitLocation() {
    const data = {
      longitude: this.longitude,
      latitude: this.latitude,
      name: ''
    };

    // 传到后端即可
    this.placeService.createPlace(data).subscribe((res: any) => {
      console.log(data);
      this.messageService.add({ severity: 'success', summary: '添加成功', detail: `您成功添加了一个地点` });
      this.longitude = null;
      this.latitude = null;
      this.geocoder.clear();
      const lng = Number(data.longitude);
      const lat = Number(data.latitude);
      this.map.flyTo({ center: [lng, lat], zoom: 8 });
      const marker = new mapboxgl.Marker({ color: '#ff69b4' }) // 粉红色标记
        .setLngLat([lng, lat])
        // .setPopup(new mapboxgl.Popup().setHTML(`<h3>${loc.name}</h3>`))
        .addTo(this.map);

    })

  }


}
