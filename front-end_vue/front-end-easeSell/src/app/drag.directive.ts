

import { Directive, EventEmitter, HostBinding, HostListener, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FileHandle } from './products/interfaces/file-handle.model';


@Directive({
  selector: '[appDrag]'
})
export class DragDirective {

  @Output() files: EventEmitter<FileHandle> = new EventEmitter();

  @HostBinding("style.background") backgroundColor: any

  constructor(private sanitizer: DomSanitizer){}

  @HostListener("dragover", ["$event"])
  public onDragOver(evt: DragEvent){
    evt.preventDefault();
    evt.stopPropagation();
    this.backgroundColor = "#999"
  }

  @HostListener("dragleave",["$event"])
  public onDragLeave(evt: DragEvent){
    evt.preventDefault();
    evt.stopPropagation();
    this.backgroundColor = "#eee"
  }

  @HostListener("drop",["$event"])
  public onDrop(evt: DragEvent){
    evt.preventDefault();
    evt.stopPropagation();
    this.backgroundColor = "#eee"


    let fileHandle: FileHandle;

    const file = evt.dataTransfer!.files[0];
    const url = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(file));

    fileHandle = { file, url };
    this.files.emit(fileHandle);
  }
}


