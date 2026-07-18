import { Component, Input, ViewChild, ElementRef, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, forkJoin } from 'rxjs';
import { GetProductByIds } from '../../../shared/action/product.action';
import { Denver } from '../../../shared/interface/theme.interface';
import { ThemeOptionService } from '../../../shared/services/theme-option.service';
import * as data from '../../../shared/data/owl-carousel';
import { GetBrands } from '../../../shared/action/brand.action';
import { ThemeOptionState } from '../../../shared/state/theme-option.state';
import { Option } from '../../../shared/interface/theme-option.interface';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-denver',
  templateUrl: './denver.component.html',
  styleUrls: ['./denver.component.scss']
})
export class DenverComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() data?: Denver;
  @Input() slug?: string;
  @ViewChild('videoCarouselTrack') videoCarouselTrack!: ElementRef;

  @Select(ThemeOptionState.themeOptions) themeOption$: Observable<Option>;

  // ── Hero banner slider ───────────────────────────────────
  public bannerSlides = [
    {
      image: 'assets/images/hero-ban.png',
      heading: 'UP TO 60% OFF',
      subheading: 'Your underneath era starts right now',
      cta: 'SHOP NOW',
      link: '/collections'
    },
    {
      image: 'assets/images/herob2.png',
      heading: 'NEW ARRIVALS',
      subheading: 'Discover the latest trends in fashion',
      cta: 'EXPLORE NOW',
      link: '/collections'
    }
  ];
  public currentBannerIndex = 0;
  public bannerAnimating    = false;
  private bannerTimer: any;
  public seoExpanded        = false;

  // ── Category section ─────────────────────────────────────
  public activeCatIndex = 0;
  public luxCategories = [
    { name: 'Lehenga Choli',   sub: 'Bridal & Festive',  badge: 'Up to 60% off', image: 'assets/images/lehanga-choli.png', link: '/collections/lehenga-choli-sets' },
    { name: 'Sarees',          sub: 'Silk & Designer',    badge: 'Min 30% off',   image: 'assets/images/saree.png',         link: '/collections/sarees'             },
    { name: 'Salwars & Suits', sub: 'Traditional Styles', badge: 'Up to 50% off', image: 'assets/images/suit-salwar.png',   link: '/collections/salwars-churidars'  },
    { name: 'Dresses',         sub: 'Western & Fusion',   badge: 'Min 40% off',   image: 'assets/images/dress.png',         link: '/collections/dresses'            },
    { name: 'Kurtis',          sub: 'Everyday Elegant',   badge: 'Up to 55% off', image: 'assets/images/kurticc.png',       link: '/collections/kurtis'             },
    { name: 'Tops',            sub: 'Every Occasion',     badge: 'Min 35% off',   image: 'assets/images/top.png',           link: '/collections/tops'               },
  ];

  public categorySlider       = data.categorySlider9;
  public productSlider6ItemMargin = data.productSlider6ItemMargin;
  public productSlider4Item   = data.productSlider;

  public featuredProductIds:  number[] = [10219, 10210, 10249, 10222];
  public featuredProductIds2: number[] = [10658, 10660, 10365, 10665];

  // Video carousel
  public currentVideoIndex = 0;
  public videoSlides = [
    { src: 'assets/images/vdo2.mp4',  title: 'Get Ready With Me - Latest Fashion Trends', loop: true, playing: false },
    { src: 'assets/images/vdo-3.mp4', title: 'Get Ready With Me - Latest Fashion Trends', loop: true, playing: false },
    { src: 'assets/images/GRWM.mp4',  title: 'Get Ready With Me - Latest Fashion Trends', loop: true, playing: false }
  ];

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private router: Router,
    private themeOptionService: ThemeOptionService
  ) {}

  ngAfterViewInit() {
    this.updateVideoCarouselPosition();
    this.startBannerAutoPlay();
  }

  ngOnDestroy() {
    this.stopBannerAutoPlay();
  }

  startBannerAutoPlay() {
    this.stopBannerAutoPlay();
    this.bannerTimer = setInterval(() => {
      this.currentBannerIndex = (this.currentBannerIndex + 1) % this.bannerSlides.length;
    }, 4000);
  }

  stopBannerAutoPlay() {
    if (this.bannerTimer) {
      clearInterval(this.bannerTimer);
      this.bannerTimer = null;
    }
  }

  nextBanner() {
    this.currentBannerIndex = (this.currentBannerIndex + 1) % this.bannerSlides.length;
    this.startBannerAutoPlay();
  }

  prevBanner() {
    this.currentBannerIndex =
      this.currentBannerIndex === 0
        ? this.bannerSlides.length - 1
        : this.currentBannerIndex - 1;
    this.startBannerAutoPlay();
  }

  goToBanner(index: number) {
    this.currentBannerIndex = index;
    this.stopBannerAutoPlay();
    this.startBannerAutoPlay();
  }

  ngOnInit() {
    if (this.data?.slug == this.slug) {
      const allProductIds = [
        ...(this.data?.content?.products_ids || []),
        ...this.featuredProductIds,
        ...this.featuredProductIds2
      ];
      const uniqueIds = [...new Set(allProductIds)];

      const getProducts$ = this.store.dispatch(new GetProductByIds({
        status: 1,
        paginate: uniqueIds.length,
        ids: uniqueIds.join(',')
      }));

      const brandIds = this.data?.content?.brands?.brand_ids;
      const getBrand$ = brandIds?.length
        ? this.store.dispatch(new GetBrands({ status: 1, ids: brandIds.join() }))
        : null;

      document.body.classList.add('skeleton-body');

      const actions = [getProducts$];
      if (getBrand$) actions.push(getBrand$);

      forkJoin(actions).subscribe({
        complete: () => {
          document.body.classList.remove('skeleton-body');
          this.themeOptionService.preloader = false;
        }
      });
    }

    this.route.queryParams.subscribe(() => {
      const isDigital = this.route.snapshot.data['data'].theme_option.productBox === 'digital';
      const items = isDigital ? 4 : 6;
      if (this.productSlider6ItemMargin?.responsive?.['1180']) {
        this.productSlider6ItemMargin = {
          ...this.productSlider6ItemMargin,
          items,
          responsive: { ...this.productSlider6ItemMargin.responsive, 1180: { items } }
        };
      }
    });
  }

  // ── Video carousel ───────────────────────────────────────

  nextVideo() {
    this.pauseAllVideos();
    this.currentVideoIndex = (this.currentVideoIndex + 1) % this.videoSlides.length;
    this.updateVideoCarouselPosition();
  }

  previousVideo() {
    this.pauseAllVideos();
    this.currentVideoIndex = this.currentVideoIndex === 0
      ? this.videoSlides.length - 1
      : this.currentVideoIndex - 1;
    this.updateVideoCarouselPosition();
  }

  updateVideoCarouselPosition() {
    setTimeout(() => {
      document.querySelectorAll('.nf-video-slide video').forEach((video: any, index) => {
        if (index === this.currentVideoIndex) {
          video.muted = false;
        } else {
          video.pause();
          video.muted = true;
        }
      });
    }, 100);
  }

  pauseAllVideos() {
    document.querySelectorAll('.nf-video-slide video').forEach((v: any) => v.pause());
  }

  getVideoTransform(index: number): string {
    const diff  = index - this.currentVideoIndex;
    const scale = index === this.currentVideoIndex ? 1 : 0.75;
    return `translateX(${diff * 20}%) scale(${scale})`;
  }

  toggleVideoPlay(index: number) {
    const videos = document.querySelectorAll('.nf-video-slide video');
    const video  = videos[index] as HTMLVideoElement;
    if (video.paused) { video.play();  this.videoSlides[index].playing = true;  }
    else              { video.pause(); this.videoSlides[index].playing = false; }
  }

  playVideo(index: number) {
    const video = document.querySelectorAll('.nf-video-slide video')[index] as HTMLVideoElement;
    video.play();
    this.videoSlides[index].playing = true;
  }

  viewVideo(_index: number) {
    this.router.navigate(['/collections'], { queryParams: { sortBy: 'asc' } });
  }

  viewAllCollections() {
    this.router.navigate(['/collections'], { queryParams: { sortBy: 'asc' } });
  }
}
